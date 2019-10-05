/**
 * WordPress dependencies
 */
import { registerBlockType } from '@wordpress/blocks';

/**
 * Internal dependencies
 */
import * as nestedPosts from './nested-posts';

/**
 * Function to register an individual block.
 *
 * @param {Object} block The block to be registered.
 *
 */
const registerBlock = block => {
	const { settings, name } = block;
	registerBlockType( name, settings );
};

/**
 * Function to register the blocks provided by the plugin.
 */
export const registerBlocks = () => {
	[
		nestedPosts,
	].forEach( registerBlock );
};

registerBlocks();