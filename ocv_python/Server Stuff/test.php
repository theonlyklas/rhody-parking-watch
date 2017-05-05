<?php
  // set up the command to be run
  $commandString = 'python3 /var/www/html/rhodyparkingtracker/car_detector.py ' . $_POST['requestedLot'] . ' 0';

  // execute the command
  $command = escapeshellcmd($commandString);
  $output_including_status = exec($command);
  echo $output_including_status;
?>
