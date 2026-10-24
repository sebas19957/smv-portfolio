import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { Dispose } from '../../shared/lib/dispose';
import { GROUP_STAGGER } from '../../features/reveal/reveal';

gsap.registerPlugin(ScrollTrigger);

const pad3 = (value: number) => String(Math.round(value)).padStart(3, '0');

/**
 * Skill meters sweep their needle from 0 to the level while the mono readout counts up, when the
 * cell reveals. Under reduced motion they simply render at their level.
 */
export function initSkillMeters(): Dispose {
  const mm = gsap.matchMedia();
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const meters = gsap.utils.toArray<HTMLElement>('[data-skill-meter]');
    const grid = meters[0]?.closest<HTMLElement>('[data-reveal-group]');
    const box = grid?.getBoundingClientRect();

    meters.forEach((meter) => {
      const level = Number(meter.dataset.skillMeter);
      const readout = meter.querySelector<HTMLElement>('[data-skill-readout]');
      const state = { value: 0 };
      gsap.set(meter, { '--p': 0 });
      if (readout) readout.textContent = pad3(0);
      const cell = meter.closest<HTMLElement>('[data-reveal]') ?? meter;
      const delay =
        (box && box.width > 0 ? ((cell.getBoundingClientRect().left - box.left) / box.width) * GROUP_STAGGER : 0) +
        0.25;

      ScrollTrigger.create({
        trigger: cell,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          gsap.to(meter, { '--p': level / 100, duration: 1.4, ease: 'power3.out', delay });
          gsap.to(state, {
            value: level,
            duration: 1.4,
            ease: 'power3.out',
            delay,
            onUpdate: () => {
              if (readout) readout.textContent = pad3(state.value);
            },
          });
        },
      });
    });

    return () => {
      meters.forEach((meter) => {
        gsap.set(meter, { clearProps: '--p' });
        const readout = meter.querySelector<HTMLElement>('[data-skill-readout]');
        if (readout) readout.textContent = pad3(Number(meter.dataset.skillMeter));
      });
    };
  });
  return () => mm.revert();
}
