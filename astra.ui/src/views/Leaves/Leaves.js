import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { LeavesTable } from './components';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3)
  },
  content: {
    marginTop: theme.spacing(2)
  }
}));

const Leaves = () => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.content}>
        <LeavesTable/>
      </div>
    </div>
  );
};

export default Leaves;
