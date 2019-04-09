<?php
/**
 * CWPNP Template Functions.
 *
 * @since 1.0.0
 *
 * @package CurateWP
 * @author JR Tashjian <jr@curatewp.com>
 */

/**
 * Ouput the nested posts.
 *
 * @since 1.0.0
 *
 * @param array $args Optional. Arguments to configure a section.
 *
 * @return string The rendered HTML.
 */
function curatewp_nested_posts( $args = array() ) {
	$post_id    = empty( $args['post_id'] ) ? get_the_ID() : $args['post_id'];
	$section_id = md5( $post_id . wp_json_encode( $args ) );

	$cache_group  = 'curatewp';
	$cached_key   = $cache_group . '_nested_posts_' . $section_id . '_posts';
	$nested_posts = wp_cache_get( $cached_key, $cache_group );

	if ( false === $nested_posts ) {
		$nested_posts = array();
		$query_args   = array();

		$query_args = array_merge(
			$query_args,
			array(
				'post_type'              => get_post_type(),
				'post_parent'            => $post_id,
				'posts_per_page'         => empty( $args['number'] ) ? 5 : abs( $args['number'] ),
				'order'                  => empty( $args['order'] ) ? '' : $args['order'],
				'orderby'                => empty( $args['orderby'] ) ? 'menu_order' : $args['orderby'],
				'no_found_rows'          => true,
				'update_post_meta_cache' => false,
				'update_post_term_cache' => false,
			)
		);

		/**
		 * Filters the query arguments for the current object in the section.
		 *
		 * @since 1.0.0
		 *
		 * @param array $query_args The object's query arguments.
		 */
		$query_args = apply_filters( 'curatewp_nested_posts_object_query_args', $query_args );

		$posts_query = new \WP_Query( $query_args );

		if ( ! $posts_query->have_posts() ) {
			return '';
		}

		$nested_posts = array_merge(
			$nested_posts,
			wp_list_pluck( $posts_query->posts, 'ID' )
		);

		/**
		 * Filters the nested post ids for the section.
		 *
		 * @since 1.0.0
		 *
		 * @param array $nested_posts The queried post ids.
		 */
		$nested_posts = apply_filters( 'curatewp_nested_posts', $nested_posts );

		/**
		 * Filters the cache time for the nested posts object.
		 *
		 * @since 1.0.0
		 *
		 * @param int $cache_time_in_seconds The cache time in seconds.
		 */
		$cache_time_in_seconds = apply_filters( 'curatewp_nested_posts_objects_cache_time', DAY_IN_SECONDS );

		wp_cache_set( $cached_key, $nested_posts, $cache_group, $cache_time_in_seconds );
	}

	// Convert class string to array and append additional wrapper classes.
	$classes   = explode( ' ', $args['class'] );
	$classes[] = 'curatewp-section';
	$classes[] = 'curatewp-section-' . $section_id;
	$classes[] = 'curatewp-section-nested-posts';

	wp_reset_postdata();
	ob_start();
	?>

	<div class="<?php echo esc_attr( join( ' ', array_filter( $classes ) ) ); ?>">
		<div class="curatewp-section-header">
			<?php if ( ! empty( $args['title'] ) ) : ?>
				<h3 class="curatewp-section-header__title"><?php echo esc_html( $args['title'] ); ?></h3>
			<?php endif; ?>

			<?php if ( ! empty( $args['description'] ) ) : ?>
				<p class="curatewp-section-header__description"><?php echo esc_html( $args['description'] ); ?></p>
			<?php endif; ?>
		</div>

		<?php if ( ! empty( $nested_posts ) ) : ?>
			<div class="curatewp-section-collection curatewp-section-collection--default">

				<?php foreach ( $nested_posts as $nested_post_id ) : ?>
					<div <?php post_class( 'curatewp-card curatewp-card--wide curatewp-grid--whole', $nested_post_id ); ?>>

						<?php
						if ( has_post_thumbnail( $nested_post_id ) ) :
							$curatewp_post_thumbnail_url = wp_get_attachment_url( get_post_thumbnail_id( $nested_post_id ) );
							?>
							<div class="curatewp-card__image" style="background-image:url(<?php echo esc_url( $curatewp_post_thumbnail_url ); ?>);"></div>
						<?php endif; ?>

						<div class="curatewp-card__content">
							<h4 class="curatewp-card__title">
								<a href="<?php the_permalink( $nested_post_id ); ?>">
									<?php echo esc_html( get_the_title( $nested_post_id ) ); ?>
								</a>
							</h4>
							<div class="curatewp-card__date">
								<?php echo esc_html( get_the_date( '', $nested_post_id ) ); ?>
							</div>
						</div>

					</div>
				<?php endforeach; ?>

			</div>
		<?php endif; ?>
	</div>

	<?php
	$output = ob_get_clean();
	return $output;
}
