import './style.scss';

import webp from '../../assets/React.webp';
import jpg from '../../assets/images.jpg';
import png from '../../assets/pepa.png';
import Svg from '../../assets/placeholder.svg';
import svgUrl from '../../assets/placeholder.svg?url';
import Layout from '../../components/Layout';

const Images = () => (
  <Layout>
    <div className="images-wrapper">
      <ul className="image-list">
        <li className="image-item">
          <img src={png} />
        </li>
        <li className="image-item">
          <img src={jpg} />
        </li>
        <li className="image-item">
          <img src={webp} />
        </li>
        <li className="image-item">
          <img src={svgUrl} />
        </li>
        <li className="image-item">
          <Svg />
        </li>
      </ul>
    </div>
  </Layout>
);

export default Images;
