// --- ぷよぷよシミュレーションの定数と設定 ---
// ... (中略) ...

// --- ゲームの状態管理 ---
// ... (中略) ...

// --- 初期化関数 ---
// ... (中略) ...

// --- ぷよの生成と操作 ---
// ... (中略) ...

// --- 連鎖判定ロジック (DFS) は変更なし ---
// ... (中略) ...


async function runChain() {
    // 1. ぷよ削除の前の遅延
    await new Promise(resolve => setTimeout(resolve, 300));

    const groups = findConnectedPuyos();

    if (groups.length === 0) {
        // 連鎖終了
        gameState = 'playing';
        generateNewPuyo();
        renderBoard();
        return;
    }

    chainCount++;

    let chainScore = calculateScore(groups, chainCount);
    score += chainScore;

    // 2. ぷよの削除 (データを更新)
    groups.forEach(({ group }) => {
        group.forEach(({ x, y }) => {
            board[y][x] = COLORS.EMPTY; 
        });
    });

    renderBoard(); // 削除後の盤面を描画 (空きスペースができる)
    updateUI();

    // 3. 削除演出の遅延
    await new Promise(resolve => setTimeout(resolve, 300));

    // 4. ぷよの落下 (データを更新)
    gravity(); 

    // 【★修正点】落下後の盤面を描画する処理を追加
    renderBoard(); 

    // 5. 落下演出の遅延
    await new Promise(resolve => setTimeout(resolve, 300));

    // 6. 再帰的に次の連鎖をチェック
    runChain();
}

function calculateScore(groups, currentChain) {
// ... (中略) ...
}

/**
 * ぷよぷよ標準の重力処理（列圧縮）
 * 各列で、空きスペースを無視してぷよを下端まで詰めます。これが「ちぎり」の動作です。
 */
function gravity() {
    for (let x = 0; x < WIDTH; x++) {
        let newColumn = [];

        // 1. ぷよだけを抽出し、下に詰める
        for (let y = 0; y < HEIGHT; y++) {
            if (board[y][x] !== COLORS.EMPTY) {
                newColumn.push(board[y][x]);
            }
        }

        // 2. 下から詰めたぷよを盤面に戻す（落下）
        for (let y = 0; y < HEIGHT; y++) {
            if (y < newColumn.length) {
                board[y][x] = newColumn[y];
            } else {
                board[y][x] = COLORS.EMPTY; // 上部を空にする
            }
        }
    }
}


// --- 描画とUI更新 ---
// ... (以下略) ...
