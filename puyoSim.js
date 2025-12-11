// --- (中略) ---

function getPuyoCoords() {
    if (!currentPuyo) return [];
    
    const { mainX, mainY, rotation } = currentPuyo;
    let subX = mainX;
    let subY = mainY;

    if (rotation === 0) subY = mainY + 1; 
    if (rotation === 1) subX = mainX - 1; 
    if (rotation === 2) subY = mainY - 1; 
    if (rotation === 3) subX = mainX + 1; 

    return [{ x: mainX, y: mainY, color: currentPuyo.mainColor },
            { x: subX, y: subY, color: currentPuyo.subColor }];
}

/**
 * ぷよが最終的に落下する位置（ゴーストぷよの位置）を計算する
 * @returns {Array<{x: number, y: number, color: number}>} ゴーストぷよの座標と色
 */
function getGhostCoords() {
    if (!currentPuyo || gameState !== 'playing') return [];

    // 現在のぷよの状態を一時的にコピー
    let tempPuyo = { ...currentPuyo };
    
    // 1. 衝突するまでY座標を下げ続ける
    while (true) {
        // 次のテスト位置を計算
        let testPuyo = { ...tempPuyo, mainY: tempPuyo.mainY - 1 };
        
        // テスト位置の座標を取得
        const testCoords = getCoordsFromState(testPuyo);
        
        // 衝突チェック
        if (checkCollision(testCoords)) {
            // 衝突した場合、一つ上の位置 (tempPuyo) が最終位置
            const finalCoords = getCoordsFromState(tempPuyo);
            
            // ゴーストぷよに色情報を持たせる
            finalCoords[0].color = currentPuyo.mainColor;
            finalCoords[1].color = currentPuyo.subColor;
            
            return finalCoords;
        }
        
        // 衝突しなければ、1マス下に移動
        tempPuyo.mainY -= 1;
        
        // 念のため、盤面最下部を大きく超えたらループを抜ける（安全策）
        if (tempPuyo.mainY < -HEIGHT) break; 
    }
    
    // 予測位置が見つからなかった場合は空の配列を返す
    return [];
}


function checkCollision(coords) {
// --- (中略) ---

function renderBoard() {
    const boardElement = document.getElementById('puyo-board');
    boardElement.innerHTML = '';
    
    // エディットモード中は落下中のぷよやゴーストを表示しない
    const isPlaying = gameState === 'playing';
    const currentPuyoCoords = isPlaying ? getPuyoCoords() : [];
    const ghostPuyoCoords = isPlaying ? getGhostCoords() : []; // ★修正: 正確なゴースト座標を取得

    for (let y = HEIGHT - 3; y >= 0; y--) { 
        for (let x = 0; x < WIDTH; x++) {
            const puyoElement = document.createElement('div');
            
            let cellColor = board[y][x]; 
            let isGhost = false;

            // 1. ゴーストぷよがこのセルにあるかチェック (プレイモードのみ)
            const puyoGhost = ghostPuyoCoords.find(p => p.x === x && p.y === y);
            if (puyoGhost) {
                cellColor = puyoGhost.color; // ★修正: ゴーストぷよに色を付ける
                isGhost = true;
            }

            // 2. 落下中のぷよがこのセルにあるかチェックし、色とクラスを上書き (プレイモードのみ)
// --- (中略) ---
