import { describe, it, expect, vi } from 'vitest';

const simulateHistoryEffect = async (selectedEmpNo, setHistoryData, fetchHistory) => {
  if (!selectedEmpNo) { setHistoryData([]); return; }
  setHistoryData([]);
  await fetchHistory(selectedEmpNo);
};

describe('Employee history state management', () => {
  it('clears historyData when selectedEmpNo is empty', async () => {
    const setHistoryData = vi.fn();
    const fetchHistory = vi.fn();
    await simulateHistoryEffect('', setHistoryData, fetchHistory);
    expect(setHistoryData).toHaveBeenCalledWith([]);
    expect(fetchHistory).not.toHaveBeenCalled();
  });

  it('clears historyData before fetch resolves on selection change', async () => {
    const calls = [];
    const setHistoryData = vi.fn(data => calls.push({ type: 'set', data }));
    const fetchHistory = vi.fn(async () => {
      await new Promise(r => setTimeout(r, 10));
      calls.push({ type: 'fetch-resolved' });
    });
    await simulateHistoryEffect('00001', setHistoryData, fetchHistory);
    expect(calls[0]).toEqual({ type: 'set', data: [] });
    expect(calls[1]).toEqual({ type: 'fetch-resolved' });
  });

  it('calls fetchHistory with the selected empno', async () => {
    const setHistoryData = vi.fn();
    const fetchHistory = vi.fn().mockResolvedValue({ data: [{ empno: '00001' }] });
    await simulateHistoryEffect('00001', setHistoryData, fetchHistory);
    expect(fetchHistory).toHaveBeenCalledWith('00001');
  });
});
