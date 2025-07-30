/*
 Copyright (C) 2021 Aman Dwivedi (aman.dwivedi5@gmail.com), Shruti Agarwal (mail2shruti.ag@gmail.com)

 SPDX-License-Identifier: GPL-2.0

 This program is free software; you can redistribute it and/or
 modify it under the terms of the GNU General Public License
 version 2 as published by the Free Software Foundation.
 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License along
 with this program; if not, write to the Free Software Foundation, Inc.,
 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
*/

"use client";

import React, { useState, useEffect } from "react";
import messages from "@/constants/messages";

// Widgets
import { Alert, Button, InputContainer, Spinner } from "@/components/Widgets";

// API Services
import { getAllFolders, createFolder } from "@/services/folders";

// Helper
import { handleError } from "@/shared/helper";

const CreateFolderPage = () => {
  const initialState = {
    parentFolder: 1,
    folderName: "",
    folderDescription: "",
  };

  const initialMessage = {
    type: "success",
    text: "",
  };

  const initialFolderList = [
    {
      id: 1,
      name: "Software Repository",
      description: "Top Folder",
      parent: null,
    },
  ];

  const [createFolderData, setCreateFolderData] = useState(initialState);
  const [folderList, setFolderList] = useState(initialFolderList);
  const [loading, setLoading] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState(initialMessage);

  const { parentFolder, folderName, folderDescription } = createFolderData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCreateFolderData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    createFolder(createFolderData)
      .then(() => {
        setMessage({
          type: "success",
          text: messages.createdFolder,
        });
        setCreateFolderData(initialState); // Clear form on success
      })
      .catch((error) => {
        handleError(error, setMessage);
      })
      .finally(() => {
        setLoading(false);
        setShowMessage(true);
      });
  };

  useEffect(() => {
    getAllFolders()
      .then((res) => {
        setFolderList(res);
      })
      .catch((error) => {
        handleError(error, setMessage);
        setShowMessage(true);
      });
  }, []);

  return (
    <div className="main-container my-3">
      {showMessage && (
        <Alert
          type={message.type}
          setShow={setShowMessage}
          message={message.text}
        />
      )}

      <h1 className="font-size-main-heading">Create a new Fossology Folder</h1>
      <br />

      <div className="row">
        <div className="col-12 col-lg-8">
          <form onSubmit={handleSubmit}>
            <InputContainer
              type="select"
              name="parentFolder"
              id="organize-folder-create-parent-folder"
              onChange={handleChange}
              options={folderList}
              property="name"
              value={parentFolder}
            >
              Select the parent folder:
            </InputContainer>

            <InputContainer
              type="text"
              name="folderName"
              id="organize-folder-create-folder-name"
              onChange={handleChange}
              placeholder="Folder name"
              value={folderName}
            >
              Enter the new folder name:
            </InputContainer>

            <InputContainer
              type="text"
              name="folderDescription"
              id="organize-folder-create-folder-description"
              onChange={handleChange}
              placeholder="Folder description"
              value={folderDescription}
            >
              Enter a meaningful description:
            </InputContainer>

            <Button type="submit" className="mt-4">
              {loading ? (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              ) : (
                "Create"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateFolderPage;
