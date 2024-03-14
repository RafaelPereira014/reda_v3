"use strict";

import React from "react";
import { Component } from "react";
import { Link } from "react-router-dom";

// Actions
import * as alertMessages from "#/actions/message-types";

// Utils
import { isNode, setDateFormat } from "#/utils";

// Components
import MediaDisplay from "./mediaDisplay";
import MediaFooter from "./mediaFooter";
import TechFile from "../techFile";
import Scripts from "./scripts";
import CommentForm from "#/containers/comments/commentForm";
import CommentsList from "#/containers/comments";
import RelatedResources from "#/containers/resources/related";
import Rating from "#/components/common/rating";
import DeleteResource from "#/containers/resources/deleteResource";
import HideResource from "../../../containers/resources/hideResource";
import ContactForm from "#/containers/resources/contactForm";
import IsAuthenticated from "#/containers/auth/isAuth";
import IsAdmin from "#/containers/auth/isAdmin";
import IsInteractor from "#/containers/auth/isInteractor";

// Scroll
import Scroll from "react-scroll";
var LinkScroll = Scroll.Link;

export default class ResourceDetails extends Component {
  constructor(props) {
    super(props);

    //
    //	Helpers
    //
    this.requiresAuth = this.requiresAuth.bind(this);
    this.scrollToComments = this.scrollToComments.bind(this);
    //
    //	Event handlers
    //
    this.setFavorite = this.setFavorite.bind(this);
    this.setHighlight = this.setHighlight.bind(this);
    this.setRating = this.setRating.bind(this);
    this.deleteCb = this.deleteCb.bind(this);
    this.fetchResourceData = this.fetchResourceData.bind(this);

    //
    //	Renders
    //
    this.printMeta = this.printMeta.bind(this);
    this.renderStatus = this.renderStatus.bind(this);

    this.state = {
      update: false,
    };
  }

  /* Get configuration and resource data */
  componentDidMount() {
    this.fetchResourceData(this.props.match.params);
  }

  componentWillUnmount() {
    this.props.resetResource();
    this.props.resetScripts();
  }

  componentDidUpdate(prevProps) {
    let { resource } = this.props.match.params;
    if (
      prevProps.match.params.resource != resource ||
      prevProps.auth.data != this.props.auth.data
    ) {
      this.fetchResourceData(this.props.match.params);
    }

    if (this.state.update) {
      this.setState({
        update: false,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { resource } = this.props;
    return (
      resource.fetched !== nextProps.resource.fetched ||
      nextProps.match.params.resource != this.props.match.params.resource ||
      this.props.scripts.fetched != nextProps.scripts.fetched ||
      nextProps.auth.isAuthenticated != this.props.auth.isAuthenticated ||
      nextState.update
    );
  }

  //
  //	Fetch data
  //
  async fetchResourceData(params) {
    this.props.resetResource();
    try {
      await this.props.fetchResource(params);

      // If this requires auth and not authed, go back
      if (
        this.requiresAuth() ||
        this.props.resource.errorMessage ||
        (!this.props.resource.data && this.props.resource.fetched)
      ) {
        let message =
          this.props.resource.errorMessage ||
          alertMessages.ALERT_RESOURCE_ACCESS_ERROR;

        this.props.addAlert(message, alertMessages.ERROR);

        if (!isNode) {
          this.props.history.push("/recursos");
        }

        // Reset resource because if there is any error,
        // the next time the user tries to access after login,
        // we assure that it will not be redirected again
        this.props.resetResource();

        // If allowed, get the favorite
      } else {
        this.props.fetchScripts(this.props.resource.data.id);
      }
    } catch (err) {
      this.props.history.goBack();
    }

    this.props.fetchConfig();
  }

  //
  //	This resource is exclusive?
  //
  requiresAuth() {
    // If no Auth and is protected and finished fetching
    /* if (this.props.resource.data && !this.props.auth.isAuthenticated && this.props.resource.data.exclusive){
			return true;
		} */
    return false;
  }

  //
  //	Print meta data
  //
  printMeta(label, data) {
    return data ? (
      <p>
        <strong>{label}: </strong>
        {(() => {
          if (label == "Email") {
            return <a href={"mailto:" + data}>{data}</a>;
          }
          return data;
        })()}
      </p>
    ) : (
      ""
    );
  }

  printHash(label, data) {
    if (data) {
      const listItems = data.map((etiq) => (
        <Link
          to={{
            pathname: "/recursos",
            state: { hashtag: etiq },
          }}
          key={Math.random()}
        >
          {" #" + etiq.split(" ").join("")}
        </Link>
      ));
      return (
        <div>
          <strong>{label}: </strong> {listItems}
        </div>
      );
    }

    return null;
  }

  printPalavrasChave(label, data) {
    let listItems = null;
    let dados = [];
    const filtered = data.filter((element) => {
      // subdominios || conceitos || tags
      return element.id === 21 || element.id === 22 || element.id === 9;
    });

    filtered.map((element) => {
      dados = dados.concat(element.Terms);
    });

    if (filtered.length > 0) {
      listItems = dados.map((etiq) => (
        <Link
          to={{
            pathname: "/recursos",
            state: { hashtag: etiq.title },
          }}
          key={etiq.id}
        >
          {etiq.title.split(" ").join("").toLowerCase() + "; "}
        </Link>
      ));

      return (
        <div>
          <strong>{label}: </strong> {listItems}
        </div>
      );
    } else {
      return listItems;
    }
  }
  //
  //	Render status
  //
  renderStatus() {
    const { approved, approvedScientific, approvedLinguistic, status } =
      this.props.resource.data;

    if (!approved) {
      return (
        <div className="alert alert-warning text-center margin__bottom--30">
          <strong>
            Pendente de validação
            {!approvedScientific
              ? " científica"
              : !approvedLinguistic
              ? " linguística"
              : null}
          </strong>
        </div>
      );
    }

    if (approved && !status) {
      return (
        <div className="alert alert-danger text-center margin__bottom--30">
          <strong>Reprovado</strong>
        </div>
      );
    }

    return null;
  }

  // Set as favorite
  setFavorite(resourceId) {
    this.props.setFavorite(resourceId);
    this.setState({
      update: true,
    });
  }

  // Set as highlight
  setHighlight(resourceId) {
    this.props.setHighlight(resourceId);
    this.setState({
      update: true,
    });
  }

  //	After delete
  deleteCb() {
    this.props.history.push("/recursos");
  }

  // Set rating for this resource
  setRating(rate) {
    if (this.props.resource.data.id) {
      this.props
        .setRating({ value: rate }, this.props.resource.data.id)
        .then(() => {
          this.fetchResourceData(this.props.match.params);
        });
    }
  }

  //	Scroll to comments
  scrollToComments() {
    var el = document.getElementById("comentar");
    var total = el.offsetTop;
    window && window.scrollTo(0, total);
  }

  searchElem(array, idToSearch) {
    return array.filter((item) => {
      return item.id === idToSearch;
    });
  }

  render() {
    const { config, resource, auth } = this.props;
    if ((resource && (!resource.fetched || !resource.data)) || !resource.data) {
      return null;
    }

    if (!config || !config.data) {
      return null;
    }

    const { scripts } = this.props;

    //const filteredHashtags = hashtags && hashtags[0][0].Terms.map((term) => term.title)
    //console.log(filteredHashtags)
    const { files, graphics, icons_placeholder } = config.data;
    const resourceInfo = resource.data;

    const { isAuthenticated } = auth;

    //const filteredHashtags = hashtags && hashtags.Terms.map((term) => term.title)
    const resourceOwner =
      resource.data.User && resource.data.User.name
        ? resource.data.User.name
        : "Utilizador inexistente";
    const formats =
      resourceInfo.Formats &&
      resourceInfo.Formats.map((format) => format.title).join(", ");
    return (
      <div className="resource-details">
        <section className="container first-details">
          {this.renderStatus()}
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <MediaDisplay
                filesPath={files + "/resources" + "/" + resourceInfo.slug}
                thumb={resourceInfo.Thumbnail}
                graphicsPath={icons_placeholder}
                format={resourceInfo.Formats[0]}
                files={files}
                type={resourceInfo.Formats[0].slug}
                file={resourceInfo.Files[0]}
                embed={resourceInfo.embed}
                link={resourceInfo.link}
              />

              <MediaFooter
                graphicsPath={graphics}
                filesPath={files + "/resources" + "/" + resourceInfo.slug}
                isFavorite={resourceInfo.isFavorite}
                isHighlight={resourceInfo.highlight}
                setFavorite={this.setFavorite}
                setHighlight={this.setHighlight}
                file={resourceInfo.Files[0]}
                url={resourceInfo.link}
                resource={resourceInfo}
              />
            </div>

            <div className="col-xs-12 col-sm-6">
              <h1 dangerouslySetInnerHTML={{ __html: resourceInfo.title }}></h1>
              <small>
                {formats && (
                  <p>
                    <strong>Formato:</strong> {formats}
                  </p>
                )}
                {resourceOwner && (
                  <IsAdmin>
                    <p>
                      <strong>Submetido por:</strong> {resourceOwner}
                    </p>
                  </IsAdmin>
                )}

                {auth &&
                auth.isAuthenticated &&
                (auth.data.user.role === "admin" ||
                  auth.data.user.role === "editor" ||
                  auth.data.user.id === resourceInfo.data.User.id) ? (
                  <p>
                    <strong>Criado a:</strong>{" "}
                    <time>{setDateFormat(resourceInfo.created_at, "LLL")}</time>
                  </p>
                ) : null}
              </small>

              {/* Admin features */}
              <IsAuthenticated>
                {auth.data &&
                  auth.data.user &&
                  (auth.data.user.id == resourceInfo.user_id ||
                    auth.data.user.role == "admin") && (
                    <div className="row">
                      <div className="col-xs-12 admin-features">
                        {auth.data.user.id != resourceInfo.user_id &&
                          auth.data.user.role == "admin" && (
                            //<a href={"mailto:"+resourceInfo.User.email+"?subject=REDA - "+resourceInfo.title} className="cta primary outline small">Contactar utilizador</a>
                            <ContactForm
                              title="Contactar utilizador"
                              resource={resourceInfo.slug}
                              className="cta primary outline small margin__right--15"
                            >
                              Contactar utilizador
                            </ContactForm>
                          )}
                        <Link
                          to={"/gerirpropostas/" + resourceInfo.slug}
                          className="cta primary no-bg small"
                        >
                          Gerir propostas
                        </Link>
                        <Link
                          to={"/editarrecurso/" + resourceInfo.slug}
                          className="cta primary no-bg small"
                        >
                          Editar recurso
                        </Link>
                        <DeleteResource
                          className="cta primary no-bg small delete-action"
                          cb={this.deleteCb}
                          item={resourceInfo.slug}
                        >
                          Eliminar
                        </DeleteResource>
                        <HideResource
                          className="cta primary no-bg small yellow"
                          cb={this.deleteCb}
                          item={resourceInfo.slug}
                        >
                          Ocultar
                        </HideResource>
                      </div>
                    </div>
                  )}
              </IsAuthenticated>

              {/* Rating */}
              <div
                className={
                  "rating" + (!auth.isAuthenticated ? " disabled" : "")
                }
              >
                <Rating
                  initialRate={
                    resourceInfo.ratingAvg
                      ? parseInt(resourceInfo.ratingAvg)
                      : 0
                  }
                  setRating={this.setRating}
                  readonly={
                    !isAuthenticated ||
                    (auth.data &&
                      (auth.data.user.role == "user" ||
                        auth.data.user.role == "student"))
                  }
                />
                {resourceInfo.ratingAvg && resourceInfo.ratingUsers && (
                  <span className="total-rating-users">
                    ({resourceInfo.ratingUsers})
                  </span>
                )}
              </div>

              {/*Some meta data*/}
              {this.printMeta("Autor", resourceInfo.author)}
              {this.printMeta("Organização", resourceInfo.organization)}
              {this.printMeta("Duração", resourceInfo.duration)}
              {this.printPalavrasChave(
                "Palavras-chave",
                resourceInfo.Taxonomies
              )}

              {/*this.printHash("Hashtags", filteredHashtags, 22)*/}
              <br />

              <div
                className="tinymce-text"
                dangerouslySetInnerHTML={{ __html: resourceInfo.description }}
              ></div>
            </div>
          </div>

          {/* Tech File */}
          <TechFile details={resourceInfo} />

          {/* Authenticated feature */}
          <IsInteractor>
            <div className="row details-buttons text-center">
              <div className="col-xs-12">
                <LinkScroll
                  className="cta primary outline"
                  to="comentar"
                  smooth={true}
                  offset={-50}
                  duration={500}
                >
                  Comentar recurso
                </LinkScroll>
                {/*<button className="cta primary outline" onClick={this.scrollToComments}>Comentar recurso</button>*/}
              </div>
            </div>
          </IsInteractor>
        </section>

        {
          /* Scripts */
          //scripts.data.map(item => console.log(item))
          //console.log(scripts.data.Taxonomies.id.find(item => item.id===6))
        }
        <Scripts
          data={scripts.data}
          resource={resourceInfo.slug}
          resourceData={resourceInfo}
          filesPath={files + "/scripts" + "/" + resourceInfo.slug}
          auth={auth}
        />

        {/* Comments */}
        <section className="comments" id="comentar">
          <div className="container">
            <div className="row">
              <div className="col-xs-12">
                <h1 className="text-center">Comentários</h1>
              </div>
            </div>
            <IsInteractor>
              <div className="row">
                <div className="col-xs-12">
                  <h5> Escreva o seu comentário </h5>
                </div>
                <div className="col-xs-12">
                  <CommentForm
                    form={"ResourceCommentForm"}
                    resource={resourceInfo.slug}
                  />
                </div>
              </div>
            </IsInteractor>

            <div className="row">
              <div className="col-xs-12">
                <CommentsList
                  resource={resourceInfo.slug}
                  match={this.props.match}
                  config={config.data}
                />
              </div>
            </div>
          </div>
        </section>

        <RelatedResources match={this.props.match} origin={resourceInfo.slug} />
      </div>
    );
  }
}
