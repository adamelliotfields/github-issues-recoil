import React from 'react';
import PropTypes from 'prop-types';

function UserWithAvatar({ user, imgMaxWidth, style }) {
  return (
    <a
      href={`https://github.com/${user.login}`}
      target="_blank"
      rel="noopener noreferrer"
      style={style}
    >
      <img
        className="avatar d-block my-0 mx-auto"
        style={{ maxWidth: imgMaxWidth }}
        src={user.avatar_url}
        alt=""
      />
      <span className="text-center">{user.login}</span>
    </a>
  );
}

UserWithAvatar.defaultProps = {
  style: {},
  imgMaxWidth: '48px',
};

UserWithAvatar.propTypes = {
  user: PropTypes.shape({
    avatar_url: PropTypes.string.isRequired,
    login: PropTypes.string.isRequired,
  }).isRequired,
  style: PropTypes.objectOf(PropTypes.any),
  imgMaxWidth: PropTypes.string,
};

export default UserWithAvatar;
