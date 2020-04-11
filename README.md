# What the heck is Twack!? 💥

## TL;DR:

- It's a modern version of Axios (HTTP data fetching).
- Small — less than 1k gzipped
- Smarter
- Familiar — Uses a familiar interface

More later...

> It's in alpha, so read the source to get started or see the tests! You can also ask me a question [on Twitter](https://twitter.com/donavon).

- thwack(url: string [,config: ThwackOptions]): ThwackResponse
- thwack.request(config: ThwackOptions): ThwackResponse
- thwack.get(url: string [,config: ThwackOptions]): ThwackResponse
- thwack.delete(url: string [,config: ThwackOptions]): ThwackResponse
- thwack.head(url: string [,config: ThwackOptions]): ThwackResponse
- thwack.post(url: string, data:any [,config: ThwackOptions]): ThwackResponse
- thwack.put(url: string, data:any [,config: ThwackOptions]): ThwackResponse
- thwack.patch(url: string, data:any [,config: ThwackOptions]): ThwackResponse
