document.addEventListener('DOMContentLoaded', function() {
    const borrowCheckboxes = document.querySelectorAll('input[name="bookIds"]');
    const returnCheckboxes = document.querySelectorAll('input[name="returnIds"]');
    const borrowBtn = document.getElementById('borrowBtn');
    const returnBtn = document.getElementById('returnBtn');

    const updateBorrowButtonState = () => {
        borrowBtn.disabled = !Array.from(borrowCheckboxes).some(cb => cb.checked);
    };

    const updateReturnButtonState = () => {
        returnBtn.disabled = !Array.from(returnCheckboxes).some(cb => cb.checked);
    };

    borrowCheckboxes.forEach(box => {
        box.addEventListener('change', updateBorrowButtonState);
    });

    returnCheckboxes.forEach(box => {
        box.addEventListener('change', updateReturnButtonState);
    });

    updateBorrowButtonState();
    updateReturnButtonState();
});
