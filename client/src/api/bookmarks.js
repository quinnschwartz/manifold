export default {

  create(bookmark) {
    const data = { attributes: bookmark };
    return {
      endpoint: `/api/v1/me/relationships/bookmarks`,
      method: 'POST',
      options: {
        body: JSON.stringify({ type: "bookmark", data })
      }
    };
  }

}
