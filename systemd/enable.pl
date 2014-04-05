#!/usr/bin/perl
use strict;
use warnings;

my $SD_UNIT_NAME = 'node-www-boilerplate@';
my $SD_SYSTEM_DIR = '/etc/systemd/system/';

my $user = $ARGV[0];
if ($user) {
  my $sd_unit_socket = "$SD_UNIT_NAME.socket";
  my $sd_unit_service = "$SD_UNIT_NAME.service";

  my $sd_unit_user_socket = "$SD_UNIT_NAME$user.socket";
  my $sd_unit_user_service = "$SD_UNIT_NAME$user.service";

  # Stopping.
  &run_command("systemctl", "kill", $sd_unit_user_socket);
  &run_command("systemctl", "kill", $sd_unit_user_service);

  # Disabling.
  &run_command("systemctl", "disable", $sd_unit_user_socket);
  &run_command("systemctl", "disable", $sd_unit_user_service);

  &run_command("cp", $sd_unit_socket, $SD_SYSTEM_DIR);
  &run_command("cp", $sd_unit_service, $SD_SYSTEM_DIR);

  # Reload changes to unit files.
  &run_command("systemctl", "daemon-reload");

  # Enabling.
  &run_command("systemctl", "enable", $sd_unit_user_socket);
  &run_command("systemctl", "enable", $sd_unit_user_service);

  # Starting.
  &run_command("systemctl", "start", $sd_unit_user_socket);
  &run_command("systemctl", "start", $sd_unit_user_service);
} else {
  die "Please specify user to install systemd service for.\n";
}

sub run_command {
  my ($cmd, @args) = @_;

  print "Executing command...\n";
  print "$cmd @args\n";

  my $ret;
  if (($ret = system($cmd, @args)) < 0) {
    die "Error executing command: $!";
  }

  if ($? & 127) {
    printf "Command died with signal %d\n", $? & 127;
  } elsif ($? >> 8) {
    printf "Command exited erroneously with return code %d\n", $? >> 8;
  } else {
    printf "Command completed successfully\n";
  }

  print "\n";
}
