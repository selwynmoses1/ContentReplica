window.showBlogDetailsFromEncoded = function(encodedData) {
  try {
    const post = JSON.parse(decodeURIComponent(encodedData));
    showBlogDetails(post);
  } catch (error) {
    console.error('Error parsing post data:', error);
  }
};

window.showBlogDetails = function(post) {
  const modal = document.getElementById('detail-modal');
  if (!modal) return;
  
  const titleEl = document.getElementById('modal-title');
  const categoryEl = document.getElementById('modal-category');
  const authorEl = document.getElementById('modal-author');
  const dateEl = document.getElementById('modal-date');
  const imageEl = document.getElementById('modal-image');
  const descriptionEl = document.getElementById('modal-description');
  const contentEl = document.getElementById('modal-content-full');
  
  if (titleEl) titleEl.textContent = post.title || '';
  if (categoryEl) {
    categoryEl.textContent = post.category || 'Article';
    categoryEl.style.display = post.category ? 'inline-block' : 'none';
  }
  if (authorEl) authorEl.textContent = post.author ? `By ${post.author}` : '';
  if (dateEl) {
    const date = post.publish_date ? new Date(post.publish_date) : null;
    dateEl.textContent = date ? date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
  }
  
  if (imageEl && post.featured_image && post.featured_image.url) {
    imageEl.src = post.featured_image.url;
    imageEl.alt = post.title || '';
    imageEl.style.display = 'block';
  } else if (imageEl) {
    imageEl.style.display = 'none';
  }
  
  if (descriptionEl) descriptionEl.textContent = post.description || '';
  
  if (contentEl) {
    if (post.content) {
      if (typeof post.content === 'string') {
        try {
          const contentObj = JSON.parse(post.content);
          if (contentObj && contentObj.children) {
            contentEl.innerHTML = renderJSONRTE(contentObj);
          } else {
            contentEl.innerHTML = post.content;
          }
        } catch (e) {
          contentEl.innerHTML = post.content;
        }
      } else if (post.content && typeof post.content === 'object') {
        contentEl.innerHTML = renderJSONRTE(post.content);
      } else {
        contentEl.innerHTML = post.description || '';
      }
    } else {
      contentEl.innerHTML = post.description || '<p>No additional content available.</p>';
    }
  }
  
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
};

window.closeModal = function() {
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
};

function renderJSONRTE(content) {
  if (!content || !content.children) return '';
  
  let html = '';
  
  content.children.forEach(child => {
    if (child.type === 'paragraph') {
      html += '<p>';
      if (child.children) {
        child.children.forEach(textNode => {
          let text = textNode.text || '';
          if (textNode.bold) text = `<strong>${text}</strong>`;
          if (textNode.italic) text = `<em>${text}</em>`;
          if (textNode.underline) text = `<u>${text}</u>`;
          html += text;
        });
      }
      html += '</p>';
    } else if (child.type === 'heading') {
      const tag = `h${child.level || 2}`;
      html += `<${tag}>${child.children?.[0]?.text || ''}</${tag}>`;
    } else if (child.type === 'link') {
      const url = child.url || '#';
      const text = child.children?.[0]?.text || '';
      html += `<a href="${url}" target="_blank">${text}</a>`;
    } else if (child.type === 'image') {
      const url = child.url || child.src || '';
      html += `<img src="${url}" alt="${child.alt || ''}" style="max-width: 100%; height: auto; border-radius: 12px; margin: 20px 0;">`;
    }
  });
  
  return html || '<p>Content is being processed...</p>';
}

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('detail-modal');
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
    }
  });
});
