import { memo } from 'react';

export const Hero = memo(() => {
  return (
    <section
      className='mb-12 bg-gradient-to-r from-amber-600/20 to-orange-600/20 rounded-2xl p-8 sm:p-12 border border-amber-500/30 backdrop-blur-sm'
      aria-labelledby='hero-heading'
    >
      <div className='text-center'>
        <h2
          id='hero-heading'
          className='text-4xl sm:text-5xl font-black text-white mb-4'
        >
          Push Your Limits{' '}
          <span role='img' aria-label='rocket'>
            🚀
          </span>
        </h2>
        <p className='text-lg text-gray-300 max-w-2xl mx-auto'>
          Experience the thrill of off-road racing with our premium collection
          of dirt bikes. Built for champions, designed for victory.
        </p>
      </div>
    </section>
  );
});

Hero.displayName = 'Hero';
