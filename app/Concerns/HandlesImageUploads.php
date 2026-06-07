<?php

namespace App\Concerns;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;

trait HandlesImageUploads
{
    /**
     * Store an uploaded image on the public disk and return its relative path.
     * Optionally deletes a previous image.
     */
    protected function storeImage(?UploadedFile $file, string $folder, ?string $previous = null): ?string
    {
        if (! $file) {
            return $previous;
        }

        if ($previous && ! str_starts_with($previous, 'http')) {
            Storage::disk('public')->delete($previous);
        }

        return $file->store($folder, 'public');
    }

    /**
     * @param  array<int, UploadedFile>  $files
     * @return array<int, string>
     */
    protected function storeImages(array $files, string $folder): array
    {
        return collect($files)
            ->filter(fn ($file) => $file instanceof UploadedFile)
            ->map(fn (UploadedFile $file) => $file->store($folder, 'public'))
            ->values()
            ->all();
    }
}
