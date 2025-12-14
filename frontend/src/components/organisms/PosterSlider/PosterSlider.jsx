import { useState, useRef, useEffect } from 'react';
import './PosterSlider.scss';
import placeholder from '@/assets/placeholder.jpg';

const PosterSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const sliderRef = useRef(null);

  const posters = [
    {
      id: 1,
      title: 'Атака титанов',
      season: 'Сезон 4',
      episode: 'Эпизод 28',
      status: 'Новинка!',
      description: 'Финальный сезон продолжается',
      image: '/placeholder.jpg',
    },
    {
      id: 2,
      title: 'Истребитель демонов',
      season: 'Season 3',
      episode: 'Episode 11',
      status: 'New!',
      description: 'Swordsmith Village Arc',
      image: '/placeholder.jpg',
    },
    {
      id: 3,
      title: 'One Piece',
      season: 'Season 20',
      episode: 'Episode 1087',
      status: 'New!',
      description: 'Wano Country Arc',
      image: '/placeholder.jpg',
    },
    {
      id: 4,
      title: 'Jujutsu Kaisen',
      season: 'Season 2',
      episode: 'Episode 23',
      status: 'New!',
      description: 'Shibuya Incident',
      image: '/placeholder.jpg',
    },
    {
      id: 5,
      title: 'My Hero Academia',
      season: 'Season 7',
      episode: 'Episode 5',
      status: 'New!',
      description: 'Final Act Begins',
      image: '/placeholder.jpg',
    },
  ];

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentSlide < posters.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }

    if (isRightSwipe && currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  return (
    <>
    <div className="poster-slider">
      <div
        className="poster-slider__track"
        ref={sliderRef}
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {posters.map((poster) => (
          <div key={poster.id} className="poster-slider__slide">
            <div
              className="poster-slider__background"
              style={{ backgroundImage: `url(${placeholder})` }}
            >
              <div className="poster-slider__overlay" />
            </div>

            <div className="poster-slider__content">
              <div className="poster-slider__info">
                <span className="poster-slider__meta">
                  {poster.title} • {poster.season}
                </span>
                <h2 className="poster-slider__title">{poster.status}</h2>
                <p className="poster-slider__description">{poster.description}</p>
              </div>

              <button className="poster-slider__play-btn">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8 5V19L19 12L8 5Z"
                    fill="currentColor"
                  />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

    
    </div>
      <div className="poster-slider__dots">
        {posters.map((_, index) => (
          <button
            key={index}
            className={`poster-slider__dot ${
              index === currentSlide ? 'poster-slider__dot--active' : ''
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      </>
  );
};

export default PosterSlider;
