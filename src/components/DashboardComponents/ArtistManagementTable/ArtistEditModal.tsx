import React, { useRef } from 'react';
import { ArtistEditModalProps } from '../../../Interfaces/ArtistInterface';
import { useEditArtist } from '../../../hooks/artist/useEditArtist';
import Spinner from '../../Shared/Spinner';
import { useCloseOnOutside } from '../../../hooks/shared/useCloseOnOutside';
import { useModalClose } from '../../../hooks/shared/useModalClose';
import ImageFileUpload from '../../Shared/ImageFileUpload/ImageFileUpload';
import { useArtistEditForm } from '../../../hooks/artist/useEditFormArtist';

const ArtistEditModal: React.FC<
  ArtistEditModalProps & { onSaveSuccess: () => void }
> = ({ artistId, onClose, onSaveSuccess }) => {
  // --- Get form state and artist data from custom hook ---
  const { formState, setFormState, loading, error, artist } =
    useArtistEditForm(artistId);

  const {
    updateArtist,
    isLoading: saving,
    error: errorSaving,
  } = useEditArtist();

  // --- Modal refs + hooks for closing ---
  const modalRef = useRef<HTMLDialogElement>(null);
  useModalClose(onClose);
  useCloseOnOutside(modalRef, onClose);

  // --- Handle image file change ---
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormState({
      ...formState,
      photoFile: file,
      photoPreview: URL.createObjectURL(file),
      selectedFileName: file.name,
    });
  };

  // --- Handle save action ---
  const handleSave = async () => {
    if (!artist) return;

    if (!formState.name.trim()) {
      setFormState({ ...formState, localError: 'Name cannot be empty' });
      return;
    }

    setFormState({ ...formState, localError: null });

    const artistData = {
      name: formState.name,
      nationality: formState.nationality,
      details: formState.details,
    };

    const formData = new FormData();
    formData.append(
      'artist',
      new Blob([JSON.stringify(artistData)], { type: 'application/json' })
    );
    if (formState.photoFile) formData.append('photo', formState.photoFile);

    try {
      await updateArtist(artist.id!, formData);
      onSaveSuccess();
      onClose();
    } catch {
      setFormState({
        ...formState,
        localError: 'Failed to save changes. Please try again.',
      });
    }
  };

  if (loading) return <Spinner />;

  if (error)
    return (
      <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/40'>
        <p className='text-red-600'>{error}</p>
      </div>
    );

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center backdrop-blur-lg bg-black/40'>
      <dialog
        ref={modalRef}
        open
        className='bg-white rounded-lg shadow-lg w-full max-w-xl p-8 max-h-[90vh] overflow-y-auto relative text-gray-800'
      >
        <h2 className='text-xl font-semibold mb-4 text-center text-gray-800'>
          Edit Artist
        </h2>

        <button
          onClick={onClose}
          className='absolute top-2 right-4 text-gray-500 hover:text-gray-700 text-lg'
          aria-label='Close modal'
          disabled={saving}
        >
          ✕
        </button>

        {(formState.localError || errorSaving) && (
          <p className='text-red-600 text-sm mb-3'>
            {formState.localError || errorSaving}
          </p>
        )}

        {/* ---- NAME ---- */}
        <label htmlFor='artist-name' className='block text-sm font-medium mb-1'>
          Name
        </label>
        <input
          id='artist-name'
          className='w-full border rounded-md p-2 mb-3'
          value={formState.name}
          disabled={saving}
          onChange={(e) => setFormState({ ...formState, name: e.target.value })}
        />

        {/* ---- NATIONALITY ---- */}
        <label
          htmlFor='artist-nationality'
          className='block text-sm font-medium mb-1'
        >
          Nationality
        </label>
        <input
          id='artist-nationality'
          className='w-full border rounded-md p-2 mb-3'
          value={formState.nationality}
          disabled={saving}
          onChange={(e) =>
            setFormState({ ...formState, nationality: e.target.value })
          }
        />

        {/* ---- DETAILS ---- */}
        <label
          htmlFor='artist-details'
          className='block text-sm font-medium mb-1'
        >
          Details
        </label>
        <textarea
          id='artist-details'
          className='w-full border rounded-md p-2 mb-4 resize-y min-h-[60px]'
          value={formState.details}
          disabled={saving}
          onChange={(e) =>
            setFormState({ ...formState, details: e.target.value })
          }
        />

        {/* ---- IMAGE ---- */}
        <ImageFileUpload
          handleFileChange={handlePhotoChange}
          selectedFileName={formState.selectedFileName}
          setSelectedFileName={(name: string) =>
            setFormState({ ...formState, selectedFileName: name })
          }
          imagePreview={formState.photoPreview}
        />

        <div className='flex justify-end gap-3 mt-6'>
          <button
            onClick={onClose}
            disabled={saving}
            className='px-4 py-1.5 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50'
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            disabled={saving}
            className='px-4 py-1.5 bg-gray-600 text-white rounded-md hover:bg-gray-700'
          >
            {saving ? 'Saving…' : 'Save'}
          </button>
        </div>
      </dialog>
    </div>
  );
};

export default ArtistEditModal;
