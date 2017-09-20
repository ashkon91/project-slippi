import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Table, Statistic, Icon, Button, Sticky } from 'semantic-ui-react'
import styles from './FileLoader.scss';
import FileRow from './FileRow';
import DismissibleMessage from './common/DismissibleMessage';

export default class FileLoader extends Component {
  props: {
    browseFolder: () => void,
    loadFolder: (path) => void,
    dismissError: (key) => void,
    playFile: (file) => void,
    store: object
  };

  refPrimary: {};

  handleRefPrimary = element => this.refPrimary = element;

  generateEmptySidebarContent() {
    const browseFolder = this.props.browseFolder;

    return (
      <div key="action" className={styles['empty-sidebar-content']}>
        <Statistic inverted={true}>
          <Statistic.Value>
            <Icon name='folder open outline' />
          </Statistic.Value>
          <Button className="top-spacer" fluid={true} compact={true} inverted={true} onClick={browseFolder}>
            Load Folder
          </Button>
        </Statistic>
      </div>
    );
  }

  generateSidebar() {
    const refPrimary = this.refPrimary;

    return (
      <Sticky context={refPrimary}>
        <div className={styles['sidebar']}>
          {this.generateEmptySidebarContent()}
        </div>
      </Sticky>
    );
  }

  generateGlobalError() {
    const store = this.props.store || {};

    const showGlobalError = store.errorDisplayFlags.global || false;
    const globalErrorMessage = store.errorMessages.global || "";
    return (
      <DismissibleMessage
        error={true}
        visible={showGlobalError}
        icon="warning circle"
        header="An error has occurred"
        content={globalErrorMessage}
        onDismiss={this.props.dismissError}
        dismissParams={["global"]}
      />
    );
  }

  generateFileSelection() {
    const store = this.props.store || {};
    const files = store.files || [];

    // Generate header row
    const headerRow = (
      <Table.Row>
        <Table.HeaderCell />
        <Table.HeaderCell>File</Table.HeaderCell>
        <Table.HeaderCell>Characters</Table.HeaderCell>
        <Table.HeaderCell>Stage</Table.HeaderCell>
        <Table.HeaderCell>Duration</Table.HeaderCell>
      </Table.Row>
    );

    // Generate a row for every file in selected folder
    const rows = files.map(function (file) {
      const fileName = file.fullPath;

      return (
        <FileRow
          key={fileName}
          file={file}
          playFile={this.props.playFile}
        />
      );
    }, this);

    return (
      <div className={styles['main']}>
        {this.generateGlobalError()}
        <Table basic="very" celled={true} inverted={true} selectable={true}>
          <Table.Header>
            {headerRow}
          </Table.Header>
          <Table.Body>
            {rows}
          </Table.Body>
        </Table>
      </div>
    );
  }

  render() {
    return (
      <div ref={this.handleRefPrimary} className={styles['layout']}>
        {this.generateSidebar()}
        {this.generateFileSelection()}
      </div>
    );
  }
}
