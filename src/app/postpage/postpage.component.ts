import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Post } from '../Model/Post';
import { PostService } from '../Postservice/post.service.interceptor';
import { QuillEditorComponent } from 'ngx-quill';

@Component({
  selector: 'app-postpage',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, QuillEditorComponent],
  templateUrl: './postpage.component.html',
  styleUrls: ['./postpage.component.css']
})
export class PostpageComponent {
  post: Post = {
    id: 0,
    postTitle: '',
    postContent: '',
    postCategory: '',
    createdate: new Date().toISOString(),
    authorEmail: '',
    likes: [],
    attachments: [],
    comments: []
  };

  customCategory: string = '';
  selectedFiles: File[] = [];

  editorModules = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ header: [1, 2, 3, false] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: () => this.uploadInlineImage()
      }
    }
  };

  constructor(private http: HttpClient, private postService: PostService) {}

  // 📁 Handle manual file selection (for attachments)
  onFileSelected(e: any) {
    this.selectedFiles = Array.from(e.target.files);
  }

  // 📤 Upload file to backend (S3/local)
  async uploadInlineImage() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res: any = await this.http.post('https://localhost:5000/api/upload', formData).toPromise();

        // Insert uploaded image into editor
        const quill = (window as any).quill;
        const range = quill.getSelection(true);
        quill.insertEmbed(range.index, 'image', res.url);

        // Optionally add to attachments
        this.post.attachments.push({ fileName: file.name, url: res.url });

      } catch (err) {
        console.error('Upload error', err);
        alert('Image upload failed');
      }
    };
  }

  async onSubmit() {
    try {
      // Upload all selected attachments (if any)
      for (const file of this.selectedFiles) {
        const formData = new FormData();
        formData.append('file', file);
        const res: any = await this.http.post('https://localhost:5000/api/upload', formData).toPromise();
        this.post.attachments.push({ fileName: file.name, url: res.url });
      }

      const categoryToSave =
        this.post.postCategory === 'Other' ? this.customCategory : this.post.postCategory;

      const payload = {
        ...this.post,
        postCategory: categoryToSave
      };

      await this.postService.create(payload).toPromise();
      alert('✅ Post submitted successfully!');

      // Reset form
      this.post = {
        id: 0,
        postTitle: '',
        postContent: '',
        postCategory: '',
        createdate: new Date().toISOString(),
        authorEmail: '',
        likes: [],
        attachments: [],
        comments: []
      };
      this.customCategory = '';
      this.selectedFiles = [];
    } catch (err: any) {
      console.error('Create post error', err);
      alert(err?.error?.message || 'Failed to submit post');
    }
  }
}
