import PropTypes from 'prop-types'
import React, { useCallback, useState } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { EditorState } from 'draft-js'
import { AtomicBlockUtils } from 'draft-js'
import { Spin } from 'antd'
import { CloseCircleOutlined } from '@ant-design/icons'
import { message } from 'antd'

export default function TextEditor({
  textContent,
  onEditorStateChange,
  toolbarCustomButtons,
}) {
  const [loading, setLoading] = useState(false)
  const typeError = 'Tipo de arquivo não suportado.'
  const imgurError = 'Erro ao carregar imagem.'

  function uploadImageCallBack(file) {
    setLoading(true)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.open('POST', 'https://api.imgur.com/3/image')
      xhr.setRequestHeader('Authorization', 'Client-ID 546c25a59c58ad7')
      const data = new FormData()
      data.append('image', file)
      xhr.send(data)
      xhr.onload = () => {
        setLoading(false)
        try {
          if (xhr.status >= 200 && xhr.status < 300) {
            const response = JSON.parse(xhr.responseText)
            if (response.success) {
              const imageUrl = response.data.link
              const contentState = textContent.getCurrentContent()
              const contentStateWithEntity = contentState.createEntity(
                'IMAGE',
                'IMMUTABLE',
                { src: imageUrl },
              )
              const entityKey = contentStateWithEntity.getLastCreatedEntityKey()
              const newEditorState = AtomicBlockUtils.insertAtomicBlock(
                textContent,
                entityKey,
                ' ',
              )
              onEditorStateChange(newEditorState)
              resolve({
                data: {
                  url: imageUrl,
                },
              })
            } else {
              reject(new Error('Erro no upload da imagem'))
            }
          } else {
            reject(new Error('Erro no Imgur'))
          }
        } catch (error) {
          reject(new Error('Erro ao processar resposta do servidor'))
        }
      }
      xhr.onerror = () => {
        setLoading(false)
        reject(new Error('Erro na requisição ou falha de rede'))
      }
    })
  }

  const loadFiles = files => {
    if (files && files.length > 0) {
      const file = files[0]
      if (file.type.startsWith('image/')) {
        uploadImageCallBack(file)
          .then(() => {
            setLoading(false)
          })
          .catch(() => {
            message.error(imgurError)
          })
      } else if (file.type !== 'text/plain') {
        message.error(typeError)
      }
    }
  }

  const handleDroppedFiles = useCallback(
    (_, files) => {
      loadFiles(files)
    },
    [textContent, onEditorStateChange],
  )

  const handlePastedFiles = useCallback(
    files => {
      loadFiles(files)
    },
    [textContent, onEditorStateChange],
  )

  const handleKeyCommand = (command, editorState) => {
    if (command === 'delete' || command === 'backspace') {
      const selection = editorState.getSelection()
      const blockKey = selection.getStartKey()
      const block = editorState.getCurrentContent().getBlockForKey(blockKey)

      if (block && block.getType() === 'atomic') {
        removeImage(block)
        return 'handled'
      }
    }
    return 'not-handled'
  }

  const blockRendererFn = block => {
    const contentState = textContent.getCurrentContent()
    const entityKey = block.getEntityAt(0)
    if (entityKey) {
      const entity = contentState.getEntity(entityKey)
      const { src } = entity.getData()
      return {
        component: () => (
          <div className="relative inline-block m-0 p-0 align-top">
            <img
              src={src}
              alt="Imagem Modelo"
              width={400}
              referrerPolicy="no-referrer"
            />
            <button
              style={{
                color: 'red',
                right: 2,
                top: 6,
              }}
              className="absolute top-1.5 right-0.5 bg-transparent opacity-100 border-0 cursor-pointer"
              onMouseDown={e => {
                e.preventDefault()
                removeImage(block)
              }}
            >
              <CloseCircleOutlined style={{ fontSize: 30 }} />
            </button>
          </div>
        ),
        editable: true,
      }
    }
    return null
  }

  const removeImage = block => {
    const blockKey = block.getKey()
    const contentState = textContent.getCurrentContent()

    const blockMap = contentState.getBlockMap()
    if (!blockMap.has(blockKey)) {
      return
    }

    const newBlockMap = blockMap.delete(blockKey)
    const newContentState = contentState.set('blockMap', newBlockMap)

    const newEditorState = EditorState.push(
      textContent,
      newContentState,
      'remove-range',
    )

    onEditorStateChange(newEditorState)
  }

  return (
    <Spin spinning={loading}>
      <Editor
        wrapperClassName="demo-wrapper"
        editorClassName="demo-editor"
        editorState={textContent}
        onEditorStateChange={onEditorStateChange}
        toolbarCustomButtons={toolbarCustomButtons}
        blockRendererFn={blockRendererFn}
        localization={{ locale: 'pt' }}
        handleDroppedFiles={handleDroppedFiles}
        handlePastedFiles={handlePastedFiles}
        handleKeyCommand={handleKeyCommand}
        toolbar={{
          image: {
            uploadCallback: uploadImageCallBack,
          },
          options: [
            'colorPicker',
            'link',
            'image',
            // 'embedded',
            'remove',
            'history',
            'inline',
            'blockType',
            'fontSize',
            'fontFamily',
            'list',
            'textAlign',
          ],
        }}
      />
    </Spin>
  )
}
TextEditor.propTypes = {
  textContent: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  onEditorStateChange: PropTypes.func,
  toolbarCustomButtons: PropTypes.any,
}
