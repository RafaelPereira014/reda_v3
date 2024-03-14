# Configuring webserver using NGINX

Since this application was developed using NodeJS as the backend technology, the best solution to provide all the static files and redirect the user to the correct paths of the server was NGINX, since this can work as a proxy between the several entry points.
Two configuration environments were used: **Development** and **Production**.

## Protected areas

It is possible to configure protected areas with server authentication without using any API. A tool used with REDA for the testing was `htpasswd`. For this, just need to run:

```
htpasswd -c /var/www/domain.com/public_html/.htpasswd username
```
When you run the above command, it will prompt you for a password for the provided username, and then create the file .htpasswd in the folder you specified. If you already have a pre-existing password file, you can omit the -c flag. You can use the -D flag to remove the specified user from a password file.

To set protection for an area, set:

```
location / {
  ...
  auth_basic "Restricted";
  auth_basic_user_file /var/www/reda.com/public_html/.htpasswd;
  ...
}
```

## Development (Vagrant Machine)

As for the development environment, there are two configuration options, one when using the server-side rendering, and other when not using server-side rendering. In both cases, if you are using a server with Gulp or other than the NodeJS server. Check the comments in the following code:

```
server {
  listen                *:80;
  server_name           reda.dev www.reda.dev;
  client_max_body_size 150m;

  root /var/www/reda/public;
  index  index.html index.htm index.php;

  access_log            /var/log/nginx/reda.access.log;
  error_log             /var/log/nginx/reda.error.log;


# Comment these if not using server rendering
  location /config/{
 	root /var/www/reda/public;
 	autoindex on;
  }

  location /assets {
    alias  /var/www/reda/.tmp/assets;
    autoindex on;
  }

# Comment these if using server rendering
  location / {
    root  /var/www/reda/public;
    index index.html;
    try_files $uri $uri/ /index.html;
  }

# Set location to / if using server render
  location /api {
    proxy_pass          http://127.0.0.1:3000;
    proxy_read_timeout  600s;
    proxy_connect_timeout  600s;
    proxy_redirect  off;
    proxy_set_header        Host $host;
	proxy_set_header        X-Real-IP $remote_addr;
    proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;


  }
  sendfile off;
}
```

## Production

For the production environment there are some things to have in mind.
In the begining, the app was not server-side rendered, so there was a need to test for the **index.html** file:
```
location ~ /(\.|index.html){
	root /var/www/reda.com/public_html/dist;
	try_files $uri $uri/ /index.html;
	auth_basic "Restricted";
    auth_basic_user_file /var/www/reda.com/public_html/.htpasswd;
}
```
During the staging, the website was blocked to external users, so there was necessary to protect the website using a "Restricted" access with *htpasswd*. The same was for NGINX Status, that was being used by the *Keymetrics* platform to monitor the server:

```
location /nginx_status {
	stub_status on;
	access_log off;
	allow 83.240.154.150;
	auth_basic "Restricted";
	auth_basic_user_file /var/www/reda.com/public_html/.htpasswd;
 }
```

One vulnerability that can lead to an memory leak is DDOS. In order to avoid this, the best solution is to make use of NGINX, since it can act as a firewall. In this case, it is necessary to limit the request processing rate with the *ngx_http_limit_req_module* module.
First, we set the parameters for a shared memory zone:

`limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s`

Then, inside of the locations that we want to limit, it is necessary to add the following code:

```
location / {
        ...
        limit_req zone=one burst=5 nodelay;
        ...
}
```
With this configuration, it is possible to limit this location to a 5 requests per second, and queue no more than 5 requests in stack. With the `nodelay`, the exceeding requests are handled as fast as possible, without waiting for the next stack to be available.


This is the final configuration:

```
limit_req_zone $binary_remote_addr zone=one:10m rate=5r/s

server {
  listen *:80;
  server_name reda.azores.gov.pt www.reda.azores.gov.pt <INTRANET SERVER IP ADDRESS>;
  client_max_body_size 60m;

  access_log      /var/log/nginx/reda.com.access.log;
  error_log       /var/log/nginx/reda.com.error.log;


  #API Documentation
  location /documentation {
          alias /var/www/reda.com/public_html/docs/site;
          auth_basic "Restricted";
          auth_basic_user_file /var/www/reda.com/public_html/.htpasswd;
  }

  #Give nginx status for Keymetrics
  location /nginx_status {
          stub_status on;
          access_log off;
          allow 83.240.154.150;
          auth_basic "Restricted";
          auth_basic_user_file /var/www/reda.com/public_html/.htpasswd;
  }

  #Scripts, styles, graphics, etc
  location /assets {
          alias /var/www/reda.com/public_html/dist/assets;
          expires                 1M;
  }
  
  #App config
  location /config {
          alias /var/www/reda.com/public_html/dist/config;
  }

  #Backend config
  location / {
          proxy_pass      http://127.0.0.1:3000;
          proxy_read_timeout      600s;
          proxy_connect_timeout   600s;
          proxy_redirect          off;
          proxy_set_header        Host $host;
          proxy_set_header        X-Real-IP $remote_addr;
          proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  #API route
  location /api {
          proxy_pass      http://127.0.0.1:3000;
          proxy_read_timeout      600s;
          proxy_connect_timeout   600s;
          proxy_redirect          off;
          proxy_set_header        Host $host;
          proxy_set_header        X-Real-IP $remote_addr;
          proxy_set_header        X-Forwarded-For $proxy_add_x_forwarded_for;
  }

  #SEO files
  location ~* /(google|robots|sitemap).*.(html|txt|xml)$ {
          root /var/www/reda.com/public_html/public/SEO;
  }
}
```