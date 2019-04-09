
const { __ } = wp.i18n;
const { registerBlockType } = wp.blocks;
const {
    ServerSideRender, PanelBody, ExternalLink,
    RangeControl, ToggleControl, SelectControl,
} = wp.components;
const { withSelect } = wp.data;
const { InspectorControls, RichText } = wp.editor;
const { Fragment } = wp.element;

const icon = <svg viewbox="0 0 24 24"><g fill="none" fill-rule="evenodd"><rect fill="#FFD700" width="24" height="24" rx="2" /><path d="M19 13H5v-2h14v2zm2 4H7v-2h14v2zM17 7v2H3V7h14z" fill="#191500" fill-rule="nonzero" /></g></svg>;

registerBlockType('curatewp/nested-posts', {
    title: __('Nested Posts', 'cwpnp'),
    description: (
        <Fragment>
            <p>{__('Display a list of posts which includes descendants of the current page.', 'cwpnp')}</p>
            <ExternalLink href="https://curatewp.com/">
                {__('Get CurateWP', 'cwpnp')}
            </ExternalLink>
        </Fragment>
    ),

    icon,
    category: 'curatewp',

    keywords: [
        __('nested', 'cwpnp'),
        __('engagement', 'cwpnp'),
        __('similar', 'cwpnp'),
    ],

    attributes: {
        title: {
            type: 'string',
        },
        description: {
            type: 'string',
        },
        number: {
            type: 'number',
            default: 5,
        },
        orderby: {
            type: 'string',
            default: 'menu_order',
        },
        order: {
            type: 'string',
            default: '',
        },
    },

    edit: withSelect(function (select) {
        return {
            post_id: select('core/editor').getCurrentPostId(),
        };
    })(function ({ post_id, setAttributes, attributes, isSelected }) {
        const { number, orderby, order, title, description } = attributes;
        return (
            <div>
                <InspectorControls>
                    <PanelBody initialOpen={true}>
                        <RangeControl
                            label={__('Number of posts to show', 'cwpnp')}
                            value={number}
                            min={1}
                            onChange={(number) => setAttributes({ number })} />

                        <SelectControl
                            label={__('Order by', 'cwpnp')}
                            value={`${orderby}/${order}`}
                            options={[
                                {
                                    /* translators: label for ordering posts by date in descending order. */
                                    label: __('Newest to Oldest', 'cwpnp'),
                                    value: 'date/desc',
                                },
                                {
                                    /* translators: label for ordering posts by date in ascending order. */
                                    label: __('Oldest to Newest', 'cwpnp'),
                                    value: 'date/asc',
                                },
                                {
                                    /* translators: label for ordering posts by title in ascending order. */
                                    label: __('A → Z', 'cwpnp'),
                                    value: 'title/asc',
                                },
                                {
                                    /* translators: label for ordering posts by title in descending order. */
                                    label: __('Z → A', 'cwpnp'),
                                    value: 'title/desc',
                                },
                                {
                                    /* translators: label for ordering posts by menu_order. */
                                    label: __('Menu Order', 'cwpnp'),
                                    value: 'menu_order/',
                                },
                            ]}
                            onChange={(value) => {
                                const [newOrderBy, newOrder] = value.split('/');
                                if (newOrder !== order) {
                                    setAttributes({ order: newOrder });
                                }
                                if (newOrderBy !== orderby) {
                                    setAttributes({ orderby: newOrderBy });
                                }
                            }} />

                    </PanelBody>
                </InspectorControls>

                {(title || isSelected) &&
                    <RichText
                        tagName="h3"
                        className="curatewp-section-header__title"
                        placeholder={__('Title for section', 'cwpnp')}
                        value={title}
                        formattingControls={[]}
                        multiline={false}
                        onChange={(title) => setAttributes({ title: title.replace(/<br>/gi, ' ') })} />
                }

                {(description || isSelected) &&
                    <RichText
                        tagName="p"
                        className="curatewp-section-header__description"
                        placeholder={__('Description for section...', 'cwpnp')}
                        value={description}
                        formattingControls={[]}
                        multiline={false}
                        onChange={(description) => setAttributes({ description: description.replace(/<br>/gi, ' ') })} />
                }

                <ServerSideRender
                    block="curatewp/nested-posts"
                    attributes={{ number, orderby, order }}
                    urlQueryArgs={{ post_id }} />

            </div>
        );
    }),

    save: function () {
        return null;
    }
});