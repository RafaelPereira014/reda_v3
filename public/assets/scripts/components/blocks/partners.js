import React from 'react';

const styles = {
	list: {
		listStyle: 'none',
		padding: '0',
		margin: '0'
	},
	listEl: {
		display: 'inline-block',
		/*width: '50%',*/
		marginBottom: '15px'
	}
}

export default () => {	
	return(
		<section className="margin__top--30">
			<h5>Outros repositórios</h5>
			<ul style={styles.list}>
				<li style={styles.listEl}>
					<a href="https://repositorioaberto.uab.pt/" target="_blank" rel="noopener noreferrer">
						<img src="https://repositorioaberto.uab.pt/image/logos/logo.png" className="img-responsive" />
					</a>
				</li>
			</ul>
		</section>
	);
}