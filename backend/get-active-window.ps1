Add-Type @"
  using System;
  using System.Runtime.InteropServices;
  public class User32 {
    [DllImport("user32.dll")]
    public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, System.Text.StringBuilder text, int count);
    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out int lpdwProcessId);
  }
"@

$h = [User32]::GetForegroundWindow()
$title = New-Object Text.StringBuilder 256
[User32]::GetWindowText($h, $title, $title.Capacity) | Out-Null
$procId = 0
[User32]::GetWindowThreadProcessId($h, [ref]$procId) | Out-Null
$proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
if ($proc) {
  $obj = @{ Title = $title.ToString(); ProcessName = $proc.ProcessName }
  $obj | ConvertTo-Json -Compress
}
