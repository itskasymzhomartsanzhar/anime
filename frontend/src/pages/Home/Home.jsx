import Menu from '@/components/organisms/Menu/Menu.jsx';
import EpisodePreview from '@/components/organisms/EpisodePreview/EpisodePreview.jsx';
import PosterSlider from '@/components/organisms/PosterSlider/PosterSlider.jsx';
import ActionButtons from '@/components/molecules/ActionButtons/ActionButtons.jsx';
import './Home.scss';
import { Link } from 'react-router-dom';
import placeholder from '@/assets/placeholder.jpg';

const Home = () => {
  const mockEpisodes = [
    {
      id: 1,
      animeId: 1,
      title: 'Episode 1',
      animeName: 'Attack on Titan',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 1,
      duration: '23:45'
    },
    {
      id: 2,
      animeId: 2,
      title: 'Episode 2',
      animeName: 'Demon Slayer',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 1,
      duration: '24:12'
    },
    {
      id: 3,
      animeId: 3,
      title: 'Episode 3',
      animeName: 'Jujutsu Kaisen',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 2,
      duration: '22:30'
    },
    {
      id: 4,
      animeId: 4,
      title: 'Episode 4',
      animeName: 'One Piece',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 2,
      duration: '23:58'
    },
    {
      id: 5,
      animeId: 5,
      title: 'Episode 5',
      animeName: 'My Hero Academia',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 3,
      duration: '24:05'
    },
    {
      id: 6,
      animeId: 6,
      title: 'Episode 6',
      animeName: 'Tokyo Revengers',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 3,
      duration: '23:22'
    },
    {
      id: 7,
      animeId: 7,
      title: 'Episode 7',
      animeName: 'Naruto Shippuden',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 4,
      duration: '23:15'
    },
    {
      id: 8,
      animeId: 8,
      title: 'Episode 8',
      animeName: 'Bleach',
      thumbnail: placeholder,
      animeImage: placeholder,
      daysAgo: 5,
      duration: '24:00'
    }
  ];

  return (
    <div className="home">
      <div className="home__content">
        <div className="home__header">
            <div className="home__left-buttons">
                <Link to="/">
                  <button className='left-button active'>
                    <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" clipRule="evenodd" d="M2.52703 2.99226C2.21184 3.01613 2.03134 3.06129 1.89388 3.12581C1.59996 3.26513 1.36107 3.48736 1.21145 3.76065C1.14202 3.88774 1.09343 4.05613 1.06774 4.34903C1.04136 4.6471 1.04136 5.03097 1.04136 5.58065V8.41935C1.04136 8.96968 1.04136 9.3529 1.06774 9.65161C1.09343 9.94387 1.14133 10.1123 1.21145 10.24C1.36071 10.5129 1.60022 10.7348 1.89388 10.8742C2.03134 10.9387 2.21184 10.9839 2.52703 11.0077C2.84846 11.0316 3.26084 11.0323 3.85302 11.0323H10.147C10.7392 11.0323 11.1515 11.0323 11.473 11.0077C11.7875 10.9832 11.9687 10.9387 12.1061 10.8742C12.3999 10.735 12.6388 10.513 12.7886 10.24C12.858 10.1123 12.9066 9.94387 12.9323 9.65097C12.9586 9.3529 12.9586 8.96903 12.9586 8.41935V5.58065C12.9586 5.03097 12.9586 4.6471 12.9323 4.34839C12.9066 4.05613 12.8587 3.88774 12.7886 3.76065C12.6389 3.48736 12.4 3.26513 12.1061 3.12581C11.9687 3.06129 11.7875 3.01613 11.4723 2.99226C11.1515 2.96839 10.7392 2.96774 10.147 2.96774H3.85233C3.26084 2.96774 2.84846 2.96774 2.52703 2.99226ZM3.83011 2H10.1692C10.7336 2 11.189 2 11.5577 2.02774C11.9367 2.05677 12.27 2.11806 12.5782 2.26387C13.0684 2.49572 13.467 2.8659 13.7168 3.32129C13.8736 3.60774 13.9389 3.91742 13.9701 4.26968C14 4.61226 14 5.03548 14 5.56V8.44C14 8.96452 14 9.38774 13.9701 9.73032C13.9389 10.0826 13.873 10.3923 13.7161 10.6787C13.4667 11.1341 13.0687 11.5045 12.5789 11.7368C12.27 11.8826 11.9367 11.9432 11.5577 11.9723C11.189 12 10.7336 12 10.1692 12H3.83081C3.26639 12 2.81028 12 2.44233 11.9723C2.06258 11.9432 1.72935 11.8819 1.42111 11.7361C0.931177 11.5042 0.532858 11.134 0.28325 10.6787C0.126353 10.3923 0.0610942 10.0826 0.0298535 9.73032C-0.000692938 9.38774 1.31242e-06 8.96452 1.31242e-06 8.44V5.56C1.31242e-06 5.03548 1.29829e-06 4.61226 0.0298535 4.26968C0.0610942 3.91742 0.126353 3.60774 0.28325 3.32129C0.53274 2.86576 0.931072 2.49536 1.42111 2.26323C1.72935 2.11742 2.06258 2.05677 2.44233 2.02774C2.81097 2 3.2657 2 3.83011 2ZM4.58058 5.64258C4.58058 4.64129 5.75593 4.02323 6.67996 4.53806L9.11395 5.89548C10.0116 6.39548 10.0116 7.60452 9.11395 8.10452L6.67996 9.46194C5.75662 9.97742 4.58058 9.35871 4.58058 8.35742V5.64258ZM6.1447 5.36774C6.09235 5.3385 6.03258 5.32271 5.97151 5.32196C5.91043 5.32122 5.85024 5.33555 5.79708 5.3635C5.74392 5.39145 5.69969 5.43201 5.66892 5.48104C5.63815 5.53008 5.62194 5.58582 5.62194 5.64258V8.35742C5.62194 8.60645 5.91421 8.76064 6.1447 8.63226L8.5787 7.27484C8.62973 7.24634 8.67197 7.20605 8.70129 7.15789C8.7306 7.10973 8.74601 7.05533 8.74601 7C8.74601 6.94467 8.7306 6.89027 8.70129 6.84211C8.67197 6.79395 8.62973 6.75366 8.5787 6.72516L6.1447 5.36774Z" fill="black"/>
                    </svg>
                    Аниме
                  </button>
                </Link>
                <Link to="/manga">
                <button className='left-button'>
                  <svg width="16" height="16" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 3.49999C7 3.49999 6.125 2.33333 4.08333 2.33333C2.04166 2.33333 1.16666 3.49999 1.16666 3.49999V11.6667C1.16666 11.6667 2.04166 11.0833 4.08333 11.0833C6.125 11.0833 7 11.6667 7 11.6667M7 3.49999V11.6667M7 3.49999C7 3.49999 7.875 2.33333 9.91666 2.33333C11.9583 2.33333 12.8333 3.49999 12.8333 3.49999V11.6667C12.8333 11.6667 11.9583 11.0833 9.91666 11.0833C7.875 11.0833 7 11.6667 7 11.6667" stroke="white" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Манга
                </button>
                </Link>
            </div>
            <ActionButtons />
        </div>

        <div className="home__main">
          <PosterSlider />
          <EpisodePreview episodes={mockEpisodes} isHomePage={true} />
        </div>
      </div>

      <Menu />
    </div>
  );
};

export default Home;
