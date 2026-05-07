import { useBlogCreateStore } from './useBlogCreateStore';

describe('useBlogCreateStore', () => {
  let revokeObjectUrlSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useBlogCreateStore.getState().reset();
    revokeObjectUrlSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
  });

  afterEach(() => {
    revokeObjectUrlSpy.mockRestore();
  });

  test('replaces cover preview and revokes previous blob url', () => {
    const firstFile = new File(['cover-1'], 'cover-1.png', { type: 'image/png' });
    const secondFile = new File(['cover-2'], 'cover-2.png', { type: 'image/png' });

    useBlogCreateStore.getState().setCoverFile(firstFile, 'blob:first-cover');
    useBlogCreateStore.getState().setCoverFile(secondFile, 'blob:second-cover');

    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:first-cover');
    expect(useBlogCreateStore.getState().coverFile).toBe(secondFile);
    expect(useBlogCreateStore.getState().coverPreviewUrl).toBe('blob:second-cover');
  });

  test('hydrate clears inline images and switches store into edit mode', () => {
    const inlineFile = new File(['inline'], 'inline.png', { type: 'image/png' });

    useBlogCreateStore.getState().setCoverFile(new File(['cover'], 'cover.png', { type: 'image/png' }), 'blob:cover');
    useBlogCreateStore.getState().registerInlineImage('inline-1', inlineFile, 'blob:inline-1');

    useBlogCreateStore.getState().hydrate({
      postId: 42,
      title: 'Updated post',
      ageRating: '18+',
      tagIds: [1, 3],
      coverPreviewUrl: 'https://cdn.example.com/cover.png',
    });

    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:cover');
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:inline-1');
    expect(useBlogCreateStore.getState()).toMatchObject({
      editingPostId: 42,
      title: 'Updated post',
      ageRating: '18+',
      tagIds: [1, 3],
      coverFile: null,
      coverPreviewUrl: 'https://cdn.example.com/cover.png',
      inlineImages: {},
    });
  });

  test('reset clears state and revokes tracked object urls', () => {
    useBlogCreateStore
      .getState()
      .setCoverFile(new File(['cover'], 'cover.png', { type: 'image/png' }), 'blob:cover-preview');
    useBlogCreateStore
      .getState()
      .registerInlineImage(
        'inline-1',
        new File(['inline'], 'inline.png', { type: 'image/png' }),
        'blob:inline-preview',
      );

    useBlogCreateStore.getState().reset();

    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:cover-preview');
    expect(revokeObjectUrlSpy).toHaveBeenCalledWith('blob:inline-preview');
    expect(useBlogCreateStore.getState()).toMatchObject({
      editingPostId: null,
      title: '',
      ageRating: '16+',
      tagIds: [],
      coverFile: null,
      coverPreviewUrl: '',
      inlineImages: {},
    });
  });
});
