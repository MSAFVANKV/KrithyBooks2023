function initializeImageCropper() {
document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const profilePic = document.getElementById('profile-pic');
    const uploadInput = document.getElementById('upload');
    const cropButton = document.getElementById('crop');
    const preview = document.getElementById('preview');
    const modalFooter = document.getElementById('modal-footer');
    let cropper;

    // Event Handlers
    profilePic.addEventListener('click', triggerFileUpload);
    uploadInput.addEventListener('change', handleFileSelection);
    cropButton.addEventListener('click', applyCrop);
    document.getElementById('close').addEventListener('click', closeCropper);
    document.getElementById('save').addEventListener('click', saveCroppedImage);

    function triggerFileUpload() {
        uploadInput.click();
    }

    function handleFileSelection() {
        const file = this.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            preview.innerHTML = `<img src="${e.target.result}" id="imageToCrop">`;

            // Wait for image to load before initializing cropper
            document.getElementById('imageToCrop').onload = initializeCropper;
        };

        reader.readAsDataURL(file);
    }

    function initializeCropper() {
        // Cleanup old instance if any
        if (cropper) cropper.destroy();

        cropper = new Cropper(document.getElementById('imageToCrop'), {
            aspectRatio: 1,
            viewMode: 2,
            autoCropArea: 1,
            cropBoxResizable: false,
            cropBoxMovable: false,
            minCropBoxWidth: 100,
            minCropBoxHeight: 100,
            maxCropBoxWidth: 100,
            maxCropBoxHeight: 100,
        });

        cropButton.style.display = 'block';
        modalFooter.style.display = 'flex';
    }

    function applyCrop() {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImage = croppedCanvas.toDataURL('image/png');

        profilePic.style.backgroundImage = `url(${croppedImage})`;
        uploadInput.value = '';  // Reset the input
        preview.innerHTML = '';
        cropButton.style.display = 'none';
        modalFooter.style.display = 'none';
    }

    function closeCropper() {
        if (cropper) cropper.destroy();
        uploadInput.value = '';  // Reset the input
        preview.innerHTML = '';
        cropButton.style.display = 'none';
        modalFooter.style.display = 'none';
    }

    function saveCroppedImage() {
        cropper.getCroppedCanvas().toBlob(blob => {
            const formData = new FormData();
            formData.append('photo', blob, `${Date.now()}.jpeg`);

            $.ajax({
                url: '/users/profile/uploadCroppedImage',
                type: 'POST',
                data: formData,
                processData: false,
                contentType: false,
                success: (response) => {
                    alert('Profile saved successfully');
                    profilePic.src = response.imageUrl; 
                },
                error: () => {
                    alert('Failed to save image');
                }
            });
        }, 'image/jpeg');
    }
});
}
initializeImageCropper();