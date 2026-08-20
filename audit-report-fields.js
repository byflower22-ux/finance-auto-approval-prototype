(function removeAuditSnapshotColumn() {
  const headerCells = document.querySelectorAll('table thead tr:first-child th');
  headerCells[6]?.remove();

  document.querySelectorAll('#reportRows tr').forEach((row) => {
    row.cells[6]?.remove();
  });

  const fieldCount = document.querySelector('.footer span:last-child');
  if (fieldCount) fieldCount.textContent = '共 27 个审计字段';
}());
