# baranwang-mcp-trends-hub MCP Server

基于 Model Context Protocol (MCP) 协议的全网热点趋势一站式聚合服务

[What is an MCP Server?](https://www.anthropic.com/news/model-context-protocol)

| <!-- --> | <!-- --> |
|-----------|---------|
| **Image Source** | Community Image |
| **Author** | [baranwang](https://github.com/baranwang) |
| **Repository** | https://github.com/baranwang/mcp-trends-hub |
| **Dockerfile** | https://github.com/baranwang/mcp-trends-hub/blob/main/Dockerfile |
| **Docker Image built by** | Docker Inc. |
| **Licence** |  |

## Tools Summary

 1. **`get-36kr-trending`**: 获取 36 氪热榜，提供创业、商业、科技领域的热门资讯，包含投融资动态、新兴产业分析和商业模式创新信息
 1. **`get-9to5mac-news`**: 获取 9to5Mac 苹果相关新闻，包含苹果产品发布、iOS 更新、Mac 硬件、应用推荐及苹果公司动态的英文资讯
 1. **`get-bbc-news`**: 获取 BBC 新闻，提供全球新闻、英国新闻、商业、政治、健康、教育、科技、娱乐等资讯
 1. **`get-bilibili-rank`**: 获取哔哩哔哩视频排行榜，包含全站、动画、音乐、游戏等多个分区的热门视频，反映当下年轻人的内容消费趋势
 1. **`get-douban-rank`**: 获取豆瓣实时热门榜单，提供当前热门的图书、电影、电视剧、综艺等作品信息，包含评分和热度数据
 1. **`get-douyin-trending`**: 获取抖音热搜榜单，展示当下最热门的社会话题、娱乐事件、网络热点和流行趋势
 1. **`get-gcores-new`**: 获取机核网游戏相关资讯，包含电子游戏评测、玩家文化、游戏开发和游戏周边产品的深度内容
 1. **`get-ifanr-news`**: 获取爱范儿科技快讯，包含最新的科技产品、数码设备、互联网动态等前沿科技资讯
 1. **`get-infoq-news`**: 获取 InfoQ 技术资讯，包含软件开发、架构设计、云计算、AI等企业级技术内容和前沿开发者动态
 1. **`get-juejin-article-rank`**: 获取掘金文章榜，包含前端开发、后端技术、人工智能、移动开发及技术架构等领域的高质量中文技术文章和教程
 1. **`get-netease-news-trending`**: 获取网易新闻热点榜，包含时政要闻、社会事件、财经资讯、科技动态及娱乐体育的全方位中文新闻资讯
 1. **`get-nytimes-news`**: 获取纽约时报新闻，包含国际政治、经济金融、社会文化、科学技术及艺术评论的高质量英文或中文国际新闻资讯
 1. **`get-smzdm-rank`**: 获取什么值得买热门，包含商品推荐、优惠信息、购物攻略、产品评测及消费经验分享的实用中文消费类资讯
 1. **`get-sspai-rank`**: 获取少数派热榜，包含数码产品评测、软件应用推荐、生活方式指南及效率工作技巧的优质中文科技生活类内容
 1. **`get-tencent-news-trending`**: 获取腾讯新闻热点榜，包含国内外时事、社会热点、财经资讯、娱乐动态及体育赛事的综合性中文新闻资讯
 1. **`get-thepaper-trending`**: 获取澎湃新闻热榜，包含时政要闻、财经动态、社会事件、文化教育及深度报道的高质量中文新闻资讯
 1. **`get-theverge-news`**: 获取 The Verge 新闻，包含科技创新、数码产品评测、互联网趋势及科技公司动态的英文科技资讯
 1. **`get-toutiao-trending`**: 获取今日头条热榜，包含时政要闻、社会事件、国际新闻、科技发展及娱乐八卦等多领域的热门中文资讯
 1. **`get-weibo-trending`**: 获取微博热搜榜，包含时事热点、社会现象、娱乐新闻、明星动态及网络热议话题的实时热门中文资讯
 1. **`get-weread-rank`**: 获取微信读书排行榜，包含热门小说、畅销书籍、新书推荐及各类文学作品的阅读数据和排名信息
 1. **`get-zhihu-trending`**: 获取知乎热榜，包含时事热点、社会话题、科技动态、娱乐八卦等多领域的热门问答和讨论的中文资讯

## Tools

### Tool: **`get-36kr-trending`**

获取 36 氪热榜，提供创业、商业、科技领域的热门资讯，包含投融资动态、新兴产业分析和商业模式创新信息

| Parameter | Type | Description |
| - | - | - |
| `type` | `string` *optional* | 分类 |

### Tool: **`get-9to5mac-news`**

获取 9to5Mac 苹果相关新闻，包含苹果产品发布、iOS 更新、Mac 硬件、应用推荐及苹果公司动态的英文资讯

### Tool: **`get-bbc-news`**

获取 BBC 新闻，提供全球新闻、英国新闻、商业、政治、健康、教育、科技、娱乐等资讯

| Parameter | Type | Description |
| - | - | - |
| `category` | `string` *optional* |  |
| `edition` | `string` *optional* | 版本，仅对 `category` 为空有效 |

### Tool: **`get-bilibili-rank`**

获取哔哩哔哩视频排行榜，包含全站、动画、音乐、游戏等多个分区的热门视频，反映当下年轻人的内容消费趋势

| Parameter | Type | Description |
| - | - | - |
| `type` | `string` *optional* | 排行榜分区 |

### Tool: **`get-douban-rank`**

获取豆瓣实时热门榜单，提供当前热门的图书、电影、电视剧、综艺等作品信息，包含评分和热度数据

| Parameter | Type | Description |
| - | - | - |
| `count` | `integer` *optional* |  |
| `start` | `integer` *optional* |  |
| `type` | `string` *optional* |  |

### Tool: **`get-douyin-trending`**

获取抖音热搜榜单，展示当下最热门的社会话题、娱乐事件、网络热点和流行趋势

### Tool: **`get-gcores-new`**

获取机核网游戏相关资讯，包含电子游戏评测、玩家文化、游戏开发和游戏周边产品的深度内容

### Tool: **`get-ifanr-news`**

获取爱范儿科技快讯，包含最新的科技产品、数码设备、互联网动态等前沿科技资讯

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* |  |
| `offset` | `integer` *optional* |  |

### Tool: **`get-infoq-news`**

获取 InfoQ 技术资讯，包含软件开发、架构设计、云计算、AI等企业级技术内容和前沿开发者动态

| Parameter | Type | Description |
| - | - | - |
| `region` | `string` *optional* |  |

### Tool: **`get-juejin-article-rank`**

获取掘金文章榜，包含前端开发、后端技术、人工智能、移动开发及技术架构等领域的高质量中文技术文章和教程

| Parameter | Type | Description |
| - | - | - |
| `category_id` | `string` *optional* |  |

### Tool: **`get-netease-news-trending`**

获取网易新闻热点榜，包含时政要闻、社会事件、财经资讯、科技动态及娱乐体育的全方位中文新闻资讯

### Tool: **`get-nytimes-news`**

获取纽约时报新闻，包含国际政治、经济金融、社会文化、科学技术及艺术评论的高质量英文或中文国际新闻资讯

| Parameter | Type | Description |
| - | - | - |
| `region` | `string` *optional* |  |
| `section` | `string` *optional* | 分类，当 `region` 为 `cn` 时无效。可选值: Africa, Americas, ArtandDesign, Arts, AsiaPacific, Automobiles, Baseball, Books/Review, Business, Climate, CollegeBasketball, CollegeFootball, Dance, Dealbook, DiningandWine, Economy, Education, EnergyEnvironment, Europe, FashionandStyle, Golf, Health, Hockey, HomePage, Jobs, Lens, MediaandAdvertising, MiddleEast, MostEmailed, MostShared, MostViewed, Movies, Music, NYRegion, Obituaries, PersonalTech, Politics, ProBasketball, ProFootball, RealEstate, Science, SmallBusiness, Soccer, Space, Sports, SundayBookReview, Sunday-Review, Technology, Television, Tennis, Theater, TMagazine, Travel, Upshot, US, Weddings, Well, World, YourMoney |

### Tool: **`get-smzdm-rank`**

获取什么值得买热门，包含商品推荐、优惠信息、购物攻略、产品评测及消费经验分享的实用中文消费类资讯

| Parameter | Type | Description |
| - | - | - |
| `unit` | `string` *optional* |  |

### Tool: **`get-sspai-rank`**

获取少数派热榜，包含数码产品评测、软件应用推荐、生活方式指南及效率工作技巧的优质中文科技生活类内容

| Parameter | Type | Description |
| - | - | - |
| `limit` | `integer` *optional* |  |
| `tag` | `string` *optional* | 分类 |

### Tool: **`get-tencent-news-trending`**

获取腾讯新闻热点榜，包含国内外时事、社会热点、财经资讯、娱乐动态及体育赛事的综合性中文新闻资讯

| Parameter | Type | Description |
| - | - | - |
| `page_size` | `integer` *optional* |  |

### Tool: **`get-thepaper-trending`**

获取澎湃新闻热榜，包含时政要闻、财经动态、社会事件、文化教育及深度报道的高质量中文新闻资讯

### Tool: **`get-theverge-news`**

获取 The Verge 新闻，包含科技创新、数码产品评测、互联网趋势及科技公司动态的英文科技资讯

### Tool: **`get-toutiao-trending`**

获取今日头条热榜，包含时政要闻、社会事件、国际新闻、科技发展及娱乐八卦等多领域的热门中文资讯

### Tool: **`get-weibo-trending`**

获取微博热搜榜，包含时事热点、社会现象、娱乐新闻、明星动态及网络热议话题的实时热门中文资讯

### Tool: **`get-weread-rank`**

获取微信读书排行榜，包含热门小说、畅销书籍、新书推荐及各类文学作品的阅读数据和排名信息

| Parameter | Type | Description |
| - | - | - |
| `category` | `string` *optional* | 排行榜分区 |

### Tool: **`get-zhihu-trending`**

获取知乎热榜，包含时事热点、社会话题、科技动态、娱乐八卦等多领域的热门问答和讨论的中文资讯

| Parameter | Type | Description |
| - | - | - |
| `limit` | `number` *optional* |  |

## Use this MCP Server

```json
{
  "mcpServers": {
    "baranwang-mcp-trends-hub": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "mcpcommunity/baranwang-mcp-trends-hub"
      ]
    }
  }
}
```

[Why is it safer to run MCP Servers with Docker?](https://www.docker.com/blog/the-model-context-protocol-simplifying-building-ai-apps-with-anthropic-claude-desktop-and-docker/)

## Rebuild this image

```console
docker build -t mcpcommunity/baranwang-mcp-trends-hub -f Dockerfile https://github.com/baranwang/mcp-trends-hub.git
```

