/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { Component } from '@wordpress/element';
import { withSelect, dispatch } from '@wordpress/data';
import {
	ServerSideRender,
	PanelBody,
	RangeControl,
	SelectControl,
	Disabled,
	Button,
} from '@wordpress/components';
import { createBlock } from '@wordpress/blocks';
import { InspectorControls } from '@wordpress/editor';
import { Warning } from '@wordpress/block-editor';

class NestedPostsEdit extends Component {
	constructor() {
		super( ...arguments );

		this.deprecateSectionDetails = this.deprecateSectionDetails.bind( this );
		this.convertSectionDetails = this.convertSectionDetails.bind( this );
	}

	deprecateSectionDetails() {
		this.props.setAttributes( {
			title: null,
			description: null,
		} );
	}

	convertSectionDetails() {
		const { getBlockIndex, clientId, attributes } = this.props;
		const { title, description } = attributes;

		const blockIndex = getBlockIndex( clientId );

		dispatch( 'core/editor' ).insertBlocks( [
			createBlock( 'core/heading', { level: 3, content: title } ),
			createBlock( 'core/paragraph', { content: description } ),
		], blockIndex, undefined, false );

		this.deprecateSectionDetails();
	}

    render() {
        const { attributes, setAttributes, isSelected, postID } = this.props;
        const { number, orderby, order } = attributes;

		return (
			<div>
				{ isSelected && attributes.title &&
					<Warning
						actions={ [
							<Button isDefault isLarge onClick={ this.deprecateSectionDetails }>{ __( 'Remove', 'cwpnp' ) }</Button>,
							<Button isPrimary isLarge onClick={ this.convertSectionDetails }>{ __( 'Convert to Blocks', 'cwpnp' ) }</Button>,
						] }>
						{ __( 'Section title and description has been deprecated.', 'cwpnp' ) }
					</Warning>
				}
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

export default withSelect( select => {
	const { getCurrentPostId, getBlockIndex } = select( 'core/editor' );

	return {
		postID: getCurrentPostId(),
		getBlockIndex,
	};
} )( NestedPostsEdit );