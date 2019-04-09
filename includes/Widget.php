<?php
/**
 * The Widget class.
 *
 * @since 1.0.0
 *
 * @package CurateWP
 * @author JR Tashjian <jr@curatewp.com>
 */

namespace CurateWP\NestedPosts;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The Widget class.
 *
 * @since 1.0.0
 */
class Widget extends \WP_Widget {
	/**
	 * Sets up a new CWPNP widget instance.
	 *
	 * @since 1.0.0
	 */
	public function __construct() {
		$widget_options = array(
			'description' => __( 'A section of nested posts.', 'cwpnp' ),
		);
		parent::__construct( 'cwpnp_widget', __( 'Nested Posts (CurateWP)', 'cwpnp' ), $widget_options );
	}

	/**
	 * Outputs the content for the current CWPNP widget instance.
	 *
	 * @since 1.0.0
	 *
	 * @param array $args     Display arguments including 'before_title', 'after_title',
	 *                        'before_widget', and 'after_widget'.
	 * @param array $instance The settings for the particular instance of the widget.
	 */
	public function widget( $args, $instance ) {
		$title       = ! empty( $instance['title'] ) ? $instance['title'] : '';
		$description = ! empty( $instance['description'] ) ? $instance['description'] : '';
		$number      = ! empty( $instance['number'] ) ? $instance['number'] : '';
		$order       = ! empty( $instance['order'] ) ? $instance['order'] : '';
		$orderby     = ! empty( $instance['orderby'] ) ? $instance['orderby'] : 'menu_order';

		echo wp_kses_post( $args['before_widget'] );

		echo wp_kses_post(
			curatewp_nested_posts(
				array(
					'title'       => $title,
					'description' => $description,
					'number'      => $number,
					'order'       => $order,
					'orderby'     => $orderby,
				)
			)
		);

		echo wp_kses_post( $args['after_widget'] );
	}

	/**
	 * Handles updating settings for the current CWPNP widget instance.
	 *
	 * @since 1.0.0
	 *
	 * @param array $new_instance New settings for this instance as input by the user via
	 *                            WP_Widget::form().
	 * @param array $old_instance Old settings for this instance.
	 *
	 * @return array Settings to save or bool false to cancel saving.
	 */
	public function update( $new_instance, $old_instance ) { // phpcs:ignore Generic.CodeAnalysis.UnusedFunctionParameter
		$instance = array();

		if ( ! empty( $new_instance['title'] ) ) {
			$instance['title'] = sanitize_text_field( $new_instance['title'] );
		}

		if ( ! empty( $new_instance['description'] ) ) {
			$instance['description'] = sanitize_text_field( $new_instance['description'] );
		}

		if ( ! empty( $new_instance['number'] ) ) {
			$instance['number'] = sanitize_text_field( $new_instance['number'] );
		}

		if ( ! empty( $new_instance['orderby'] ) ) {
			$orderby_values = explode( '/', $new_instance['orderby'] );

			$instance['orderby'] = sanitize_text_field( $orderby_values[0] );
			$instance['order']   = sanitize_text_field( $orderby_values[1] );
		}

		return $instance;
	}

	/**
	 * Outputs the settings update form.
	 *
	 * @since 1.0.0
	 * @see WP_Widget::form()
	 *
	 * @param array $instance Current settings.
	 */
	public function form( $instance ) {
		$title       = isset( $instance['title'] ) ? $instance['title'] : '';
		$description = isset( $instance['description'] ) ? $instance['description'] : '';
		$number      = isset( $instance['number'] ) ? $instance['number'] : '';
		$order       = isset( $instance['order'] ) ? $instance['order'] : '';
		$orderby     = isset( $instance['orderby'] ) ? $instance['orderby'] : 'menu_order';

		$orderby_value = $orderby . '/' . $order;
		?>
		<div class="curatewp-widget-form-controls">
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>">
					<?php esc_attr_e( 'Title:', 'cwpnp' ); ?>
				</label>
				<input type="text" class="widefat"
					id="<?php echo esc_attr( $this->get_field_id( 'title' ) ); ?>"
					name="<?php echo esc_attr( $this->get_field_name( 'title' ) ); ?>"
					value="<?php echo esc_attr( $title ); ?>" />
			</p>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'description' ) ); ?>">
					<?php esc_attr_e( 'Description:', 'cwpnp' ); ?>
				</label>
				<textarea rows="5" cols="30" class="widefat"
					id="<?php echo esc_attr( $this->get_field_id( 'description' ) ); ?>"
					name="<?php echo esc_attr( $this->get_field_name( 'description' ) ); ?>"><?php echo esc_textarea( $description ); ?></textarea>
			</p>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'number' ) ); ?>">
					<?php esc_attr_e( 'Number of posts to show:', 'cwpnp' ); ?>
				</label>
				<input type="number" class="tiny-text"
					id="<?php echo esc_attr( $this->get_field_id( 'number' ) ); ?>"
					name="<?php echo esc_attr( $this->get_field_name( 'number' ) ); ?>"
					value="<?php echo esc_attr( $number ?: 5 ); ?>"
					step="1"
				/>
			</p>
			<p>
				<label for="<?php echo esc_attr( $this->get_field_id( 'orderby' ) ); ?>">
					<?php esc_attr_e( 'Order by', 'cwpnp' ); ?>
				</label>
				<select class="widefat"
					id="<?php echo esc_attr( $this->get_field_id( 'orderby' ) ); ?>"
					name="<?php echo esc_attr( $this->get_field_name( 'orderby' ) ); ?>">

					<option value="date/desc" <?php selected( $orderby_value, 'date/desc' ); ?>>
						<?php esc_html_e( 'Newest to Oldest', 'cwpnp' ); ?>
					</option>
					<option value="date/asc" <?php selected( $orderby_value, 'date/asc' ); ?>>
						<?php esc_html_e( 'Oldest to Newest', 'cwpnp' ); ?>
					</option>
					<option value="title/asc" <?php selected( $orderby_value, 'title/asc' ); ?>>
						<?php esc_html_e( 'A → Z', 'cwpnp' ); ?>
					</option>
					<option value="title/desc" <?php selected( $orderby_value, 'title/desc' ); ?>>
						<?php esc_html_e( 'Z → A', 'cwpnp' ); ?>
					</option>
					<option value="menu_order/" <?php selected( $orderby_value, 'menu_order/' ); ?>>
						<?php esc_html_e( 'Random', 'cwpnp' ); ?>
					</option>
				</select>
			</p>
		</div>
		<?php
	}
}
