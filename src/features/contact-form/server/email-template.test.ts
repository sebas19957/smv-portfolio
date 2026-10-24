import { describe, expect, it } from 'vitest';
import { escapeHtml, generateContactEmailTemplate } from './email-template';

const base = { name: 'Ada', email: 'ada@example.com', message: 'Hello there', ip: '203.0.113.7' };

describe('escapeHtml', () => {
  it('escapes the five HTML-significant characters', () => {
    expect(escapeHtml(`<a href="x">Tom & 'Jerry'</a>`)).toBe(
      '&lt;a href=&quot;x&quot;&gt;Tom &amp; &#39;Jerry&#39;&lt;/a&gt;',
    );
  });
});

describe('generateContactEmailTemplate', () => {
  it('renders the sender details, IP and message', () => {
    const html = generateContactEmailTemplate(base);
    expect(html.startsWith('<!DOCTYPE html')).toBe(true);
    expect(html).toContain('>Ada</span>');
    expect(html).toContain('href="mailto:ada@example.com"');
    expect(html).toContain('203.0.113.7');
    expect(html).toContain('Hello there');
    expect(html).toContain(`© ${new Date().getFullYear()} SMV PORTFOLIO ENGINE`);
  });

  it('escapes user-controlled values so they cannot inject markup', () => {
    const html = generateContactEmailTemplate({
      name: '<script>alert(1)</script>',
      email: '"><img src=x onerror=alert(1)>@x.com',
      message: '<b>bold</b> & more',
      ip: '<ip>',
    });
    expect(html).not.toContain('<script>');
    expect(html).not.toContain('<img');
    expect(html).not.toContain('<b>');
    expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
    expect(html).toContain('href="mailto:&quot;&gt;&lt;img src=x onerror=alert(1)&gt;@x.com"');
    expect(html).toContain('&lt;b&gt;bold&lt;/b&gt; &amp; more');
    expect(html).toContain('&lt;ip&gt;');
  });

  it('turns message newlines into line breaks', () => {
    const html = generateContactEmailTemplate({ ...base, message: 'line one\nline two\r\nline three' });
    expect(html).toContain('line one<br/>line two<br/>line three');
  });
});
