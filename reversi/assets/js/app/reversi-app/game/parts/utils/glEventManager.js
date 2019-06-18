export const resizeBoard = container => {
  const board = $('.board');
  const { width, height } = container;
  if (width >= height) {
    board.width(height - 20);
    board.height(height - 20);
  } else {
    board.width(width);
    board.height(width);
  }
};

export const listenResizeEvent = layout => {
  layout.on('componentCreated', component => {
    component.container.on('resize', () => {
      if (component.config.component === 'ゲーム画面') {
        resizeBoard(component.container);
      }
    });
  });
};
