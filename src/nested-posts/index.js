/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { ExternalLink } from '@wordpress/components';

/**
 * Internal dependencies
 */
import edit from './edit';
import icon from './icon';

export const name = 'curatewp/nested-posts';

export const settings = {
    title: __( 'Nested Posts', 'cwpnp' ),
	description: (
		<Fragment>
			<p>{ __( 'Display a list of posts which includes descendants of the current page.' ) }</p>
			<ExternalLink href="https://curatewp.com/">
				{ __( 'Get CurateWP', 'cwpnp' ) }
			</ExternalLink>
		</Fragment>
    ),
    icon,
    category: 'curatewp',
    keywords: [ __( 'nested', 'cwpnp' ), __( 'engagement', 'cwpnp' ), __( 'similar', 'cwpnp' ) ],
	edit,
	save: () => null,
};