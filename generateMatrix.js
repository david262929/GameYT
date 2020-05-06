function generateMatrix(size) {
    const result =[];
    for( let y = 0; y <size.height; y++){
        for(let x = 0; x <size.width; x++){
            result.push({x,y});
        }
    }
    return result;
}
