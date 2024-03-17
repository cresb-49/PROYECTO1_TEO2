export const generatePagesToShow = (currentPage, totalPages) => {
    let pagesToShow = [];
    if (totalPages === 0){
        return pagesToShow;
    }
    for (let i = currentPage - 2; i <= currentPage - 1; i++) {
        if (i >= 1) { // Ensure the page is within valid range
            pagesToShow.push(i);
        }
    }
    pagesToShow.push(currentPage);
    for (let i = currentPage + 1; i <= currentPage + 2; i++) {
        if (i <= totalPages) {
            pagesToShow.push(i);
        }
    }
    return pagesToShow;
};