// TODO

const setCookie = (res, key, token) => {
    return res.cookie(key, token, {
      secure: process.env.NODE_ENV !== "developement",
      httpOnly: true,
      // set cookie life for 10 days
      maxAge: 864000000,
    });
  };

