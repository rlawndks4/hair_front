// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_MANAGER = '/manager';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  login: '/manager/login',
};

export const PATH_MANAGER = {
  root: ROOTS_MANAGER,
  user: {
    root: path(ROOTS_MANAGER, '/user'),
    list: path(ROOTS_MANAGER, '/user/list'),
    add: path(ROOTS_MANAGER, '/user/add'),
  },
  point: {
    root: path(ROOTS_MANAGER, '/point'),
    list: path(ROOTS_MANAGER, '/point/list'),
    add: path(ROOTS_MANAGER, '/point/add'),
  },
  shop: {
    root: path(ROOTS_MANAGER, '/shop'),
    list: path(ROOTS_MANAGER, '/shop/list'),
    add: path(ROOTS_MANAGER, '/shop/add'),
  },
  teacher: {
    root: path(ROOTS_MANAGER, '/teacher'),
    list: path(ROOTS_MANAGER, '/teacher/list'),
    add: path(ROOTS_MANAGER, '/teacher/add'),

  },
  post: {
    root: path(ROOTS_MANAGER, '/post'),
    list: path(ROOTS_MANAGER, '/post/list'),
    add: path(ROOTS_MANAGER, '/post/add'),

  },
  reservation: {
    root: path(ROOTS_MANAGER, '/reservation'),
    list: path(ROOTS_MANAGER, '/reservation/list'),
    add: path(ROOTS_MANAGER, '/reservation/add'),
  },
  alarm: {
    root: path(ROOTS_MANAGER, '/alarm'),
    list: path(ROOTS_MANAGER, '/alarm/list'),
    add: path(ROOTS_MANAGER, '/alarm/add'),
  },
};
