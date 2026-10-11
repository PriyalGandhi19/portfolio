import React, { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  ogImage?: string;
  ogUrl?: string;
}

export const SEO: React.FC<SEOProps> = ({
  title = 'Full Stack Engineer | Portfolio & Systems Architecture',
  description = 'Production-ready full stack engineer specializing in React, TypeScript, Python, Django REST, PostgreSQL, and Web Security.',
  keywords = ['Full Stack Engineer', 'React', 'TypeScript', 'Django', 'PostgreSQL', 'Web Security', 'Software Architecture'],
  ogImage = '/og-image.png',
  ogUrl = 'https://portfolio.local',
}) => {
  useEffect(() => {
    document.title = title;

    const updateMetaTag = (nameAttr: string, valueAttr: string, content: string) => {
      let element = document.querySelector(`meta[${nameAttr}="${valueAttr}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(nameAttr, valueAttr);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords.join(', '));
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:url', ogUrl);
    updateMetaTag('property', 'og:type', 'website');
    updateMetaTag('name', 'twitter:card', 'summary_large_image');
    updateMetaTag('name', 'twitter:title', title);
    updateMetaTag('name', 'twitter:description', description);
    updateMetaTag('name', 'twitter:image', ogImage);
  }, [title, description, keywords, ogImage, ogUrl]);

  return null;
};

export default SEO;