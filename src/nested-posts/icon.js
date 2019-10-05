/**
 * WordPress dependencies
 */
import { Path, Rect, G, SVG } from '@wordpress/components';

export default (
    <SVG viewBox="0 0 24 24">
        <G fill="none" fillRule="evenodd">
            <Rect fill="#FFD700" width="24" height="24" rx="2" />
            <Path d="M19 13H5v-2h14v2zm2 4H7v-2h14v2zM17 7v2H3V7h14z" fill="#191500" fillRule="nonzero" />
        </G>
    </SVG>
);