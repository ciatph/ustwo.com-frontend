import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import he from 'he';
import get from 'lodash/object/get';
import find from 'lodash/collection/find';

import Flux from '../flux';

import SVG from '../elements/svg';
import Rimage from '../elements/rimage';

export default class BlogPostListItem extends React.Component {
  render() {
    const props = this.props;
    const post = props.data;
    const category = get(post, '_embedded.wp:term.0.0', {});
    const classes = classnames('blog-post-list-item', `blog-label-${get(category, 'slug', 'category')}`, {
      featured: props.featured
    });
    const attachments = get(post, '_embedded.wp:attachment', []);
    const imageURL = get(attachments, '1.source_url', '');
    const featuredImage = find(attachments, 'id', get(post, 'featured_image'));
    const uri = `/blog/${get(post, 'slug')}`;

    return (
      <article className={classes}>
        <Rimage className="image" wrap="div" href={uri} sizes={get(featuredImage, 'media_details.sizes')} />
        <div className="content">
          <div className="blog-category">{get(category, 'name', 'category')}</div>
          <h2 className="title"><a href={uri} onClick={Flux.override(uri)}>{he.decode(get(post, 'title.rendered'))}</a></h2>
          <p className="meta">By {get(post, '_embedded.author.0.first_name')} {get(post, '_embedded.author.0.last_name')} - <span className="date">{moment(get(post, 'date')).format('D MMMM YYYY')}</span></p>
          <div className="excerpt" dangerouslySetInnerHTML={{ __html: get(post, 'excerpt.rendered')}} />
          <div className="tail">
            <a href={uri} onClick={Flux.override(uri)}>Read more</a>
            {this.renderSocialMediaShareCounts()}
          </div>
        </div>
      </article>
    );
  }
  renderSocialMediaShareCounts = () => {
    return (
      <div className="social-media">
        <div className="channel facebook">
          <div className='logo'><SVG className='facebook-icon' spritemapID='facebook' /></div>
          <span>{get(this.props.data, 'facebookShares')}</span>
        </div>
        <div className="channel twitter">
          <div className='logo'><SVG className='twitter-icon' spritemapID='twitter' /></div>
          <span>{get(this.props.data, 'twitterShares')}</span>
        </div>
      </div>
    );
  }
}
