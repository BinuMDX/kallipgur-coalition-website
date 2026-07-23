import React from 'react';
import Card from '../ui/Card';

interface Article {
  id: string;
  category: string;
  date: string;
  title: string;
  excerpt: string;
  isFeatured?: boolean;
  icon?: React.ReactNode;
}

export default function News() {
  const articles: Article[] = [
    {
      id: '1',
      category: 'Community Event',
      date: '24 March, 2026',
      title: 'Annual Elders Gathering brings together over 100 community leaders',
      excerpt: 'This weekend, the Kallipgur Coalition hosted the 24th Annual Elders Gathering on Country. The three-day event provided a vital space for storytelling, cultural knowledge sharing, and discussing the strategic direction of our youth programs for the coming year...',
      isFeatured: true,
    },
    {
      id: '2',
      category: 'Program Update',
      date: '12 March, 2026',
      title: 'New funding secured for Youth Empowerment Hub expansion',
      excerpt: 'We are thrilled to announce a new multi-year funding partnership that will allow us to double the capacity of our after-school tutoring and mentorship program.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5" opacity="0.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
    },
    {
      id: '3',
      category: 'Health',
      date: '02 March, 2026',
      title: 'Mobile health clinic launches in remote communities',
      excerpt: 'Our new custom-fitted mobile health clinic hit the road this week, bringing culturally safe primary healthcare directly to families living outside the regional centre.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5" opacity="0.5">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      ),
    },
    {
      id: '4',
      category: 'Advocacy',
      date: '18 February, 2026',
      title: 'Kallipgur Coalition presents at National Indigenous Policy Summit',
      excerpt: 'Our Chairperson, Aunty Rosemary Garrawurra, delivered a powerful keynote address advocating for structural reform in community-led economic development.',
      icon: (
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5" opacity="0.5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
        </svg>
      ),
    },
  ];

  return (
    <div className="news-grid" data-animate="fade-up">
      {articles.map((article) => (
        <Card
          key={article.id}
          as="article"
          className={`news-card ${article.isFeatured ? 'news-card--featured' : ''}`.trim()}
        >
          <div className="news-card-img">
            {article.isFeatured ? (
              <div className="news-card-img-placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--clr-gold)" strokeWidth="1.5" opacity="0.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <circle cx="8.5" cy="8.5" r="1.5"></circle>
                  <polyline points="21 15 16 10 5 21"></polyline>
                </svg>
              </div>
            ) : (
              <div className="news-card-img-placeholder">
                {article.icon}
              </div>
            )}
          </div>
          <div className="news-card-body">
            <div className="news-card-meta">
              <span className="news-card-cat">{article.category}</span>
              <span className="news-card-date">{article.date}</span>
            </div>
            <h2 className="news-card-title">{article.title}</h2>
            <p className="news-card-excerpt">{article.excerpt}</p>
            <a href="#" className="news-card-link" onClick={(e) => e.preventDefault()}>
              Read Full Story <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </Card>
      ))}
    </div>
  );
}
