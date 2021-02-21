import NewsAPI from 'newsapi';
import Users from '../models/user.model.js';

const newsapi = new NewsAPI('24fe88ad1b1a4978b89de84073fa6046');

export const getNews = async (req, res) => {
  try {
    const { issue, user1Id, user2Id } = req.body;
    // const { issue, user1Id, user2Id } = req.params;

    const user1 = await Users.findById(user1Id);
    const user2 = await Users.findById(user2Id);
    let seen1 = user1.news.get(issue) ? user1.news.get(issue) : [];
    let seen2 = user2.news.get(issue) ? user2.news.get(issue) : [];
    const set = new Set(seen1.concat(seen2));

    const received = await newsapi.v2.everything({
      q: issue,
      language: 'en',
      sources: 'associated-press, reuters, usa-today, cbs-news, bbc-news',
      pageSize: set.size + 1,
      sortBy: 'publishedAt',
    });

    const news = received.articles;

    let foundArticle = null;
    for (let article of news) {
      if (!set.has(article.url)) {
        foundArticle = article;
        break;
      }
    }

    if (foundArticle) {
      await Users.findByIdAndUpdate(user1Id, {
        $push: {
          ['news.' + issue]: foundArticle.url,
        },
      });
      await Users.findByIdAndUpdate(user2Id, {
        $push: {
          ['news.' + issue]: foundArticle.url,
        },
      });
      res.status(200).json({ article: foundArticle });
    } else {
      res.status(202).json({ msg: "Couldn't find another article!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'There was an error with the database' });
  }
};
