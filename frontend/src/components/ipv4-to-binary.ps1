$ip = read-host "IPv4 Adresse?"
$octetts = @($ip.Split("."))
$binarys = @()

foreach($octett in $octetts) {
    $bin = '{0:d8}' -f [int]([convert]::ToString($octett, 2))
    $binarys = $binarys + $bin
}

$ip_bin = $binarys -join ('.')
$ip_bin