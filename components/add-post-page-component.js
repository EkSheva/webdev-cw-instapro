import { renderHeaderComponent } from './header-component'
import { renderUploadImageComponent } from './upload-image-component'

export function renderAddPostPageComponent({ appEl, onAddPostClick }) {
    let imageUrl = ''
    const render = () => {
        // @TODO: Реализовать страницу добавления поста

        const appHtml = `
    <div class="page-container">
        <div class="header-container">
        </div>
        <div class="form">
            <h3 class="form-title">Добавить пост</h3>
            <div class="form-inputs">
                <div class="upload-image-container">
                    <div class="upload=image">
      
                        <label class="file-upload-label secondary-button">
                            <input type="file" class="file-upload-input" style="display:none">
                            Выберите фото
                        </label>
          
                    </div>
                </div>
                <label>
                    Опишите фотографию:
                    <textarea class="input textarea" rows="4"></textarea>
                </label>
                <button class="button" id="add-button">Добавить</button>
            </div>
        </div>

    </div>
  `

        appEl.innerHTML = appHtml
        // Рендерим заголовок страницы
        renderHeaderComponent({
            element: document.querySelector('.header-container'),
        })

        // Pендерим компонент загрузки изображения
        const uploadImageContainer = appEl.querySelector(
            '.upload-image-container',
        )

        if (uploadImageContainer) {
            renderUploadImageComponent({
                element: uploadImageContainer,
                onImageUrlChange(newImageUrl) {
                    imageUrl = newImageUrl
                },
            })
        }

        document.getElementById('add-button').addEventListener('click', () => {
            const description = document.querySelector(
                'textarea.input.textarea',
            ).value
            if (!description) {
                alert('Пожалуйста, введите описание фотографии.')
                return
            }

            if (!imageUrl) {
                alert('Пожалуйста, выберите фотографию.')
                return
            }
            onAddPostClick({
                description: description,
                imageUrl: imageUrl,
            })
        })
    }

    render()
}
