/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { withSelect } from '@wordpress/data';
import {
	ServerSideRender,
	PanelBody,
	RangeControl,
	SelectControl,
	Disabled,
} from '@wordpress/components';
import { InspectorControls } from '@wordpress/editor';

class NestedPostsEdit extends Component {
    render() {
        const { attributes, setAttributes, postID } = this.props;
        const { number, orderby, order } = attributes;

		return (
			<div>
				<InspectorControls>
					<PanelBody initialOpen={ true }>
						<RangeControl
							label={ __( 'Number of posts to show', 'cwpnp' ) }
							value={ number }
							min={ 1 }
							onChange={ ( number ) => setAttributes( { number } ) } />

						<SelectControl
							label={ __( 'Order by', 'cwpnp' ) }
							value={ `${ orderby }/${ order }` }
							options={ [
								{
									/* translators: label for ordering posts by date in descending order. */
									label: __( 'Newest to Oldest', 'cwpnp' ),
									value: 'date/desc',
								},
								{
									/* translators: label for ordering posts by date in ascending order. */
									label: __( 'Oldest to Newest', 'cwpnp' ),
									value: 'date/asc',
								},
								{
									/* translators: label for ordering posts by title in ascending order. */
									label: __( 'A → Z', 'cwpnp' ),
									value: 'title/asc',
								},
								{
									/* translators: label for ordering posts by title in descending order. */
									label: __( 'Z → A', 'cwpnp' ),
									value: 'title/desc',
								},
								{
									/* translators: label for ordering posts by menu_order. */
									label: __( 'Menu Order', 'cwpnp' ),
									value: 'menu_order/',
								},
							] }
							onChange={ ( value ) => {
								const [ newOrderBy, newOrder ] = value.split( '/' );
								if ( newOrder !== order ) {
									setAttributes( { order: newOrder } );
								}
								if ( newOrderBy !== orderby ) {
									setAttributes( { orderby: newOrderBy } );
								}
							} } />

					</PanelBody>
				</InspectorControls>

				<Disabled>
					<ServerSideRender
						block="curatewp/nested-posts"
						attributes={ attributes }
						urlQueryArgs={ { postID } } />
				</Disabled>

			</div>
		);
    };
}

export default withSelect( select => ( {
    postID: select( 'core/editor' ).getCurrentPostId(),
} ) )( NestedPostsEdit );