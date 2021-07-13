import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import uuid from 'react-uuid';
import ReactMd from 'react-md-file';

const useStyles = makeStyles((theme) => ({
  markdown: {
    ...theme.typography.body2,
    padding: theme.spacing(3, 0),
  },
}));

export default function Main(props) {
  const classes = useStyles();
  const { posts, title } = props;

  return (
    <Grid item xs={12} md={8}> 
      <Typography variant="h6" gutterBottom>
        {title}
      </Typography>
      <Divider /> 
      {posts.map((post) => (
        <ReactMd fileName={post} key={`${post.toString().substring(0, 40)}-${uuid()}`} />
      ))}
    </Grid>
  );
}

Main.propTypes = {
  posts: PropTypes.array,
  title: PropTypes.string,
};
