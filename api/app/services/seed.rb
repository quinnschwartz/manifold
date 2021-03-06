require "securerandom"

class Seed
  # rubocop:disable Metrics/MethodLength
  def self.execute(logger = nil)
    logger ||= Logger.new(STDOUT)

    admin_user = User.find_or_initialize_by(
      email: "cli@manifold.app",
      first_name: "CLI",
      last_name: "User",
      is_cli_user: true,
      role: User::ROLE_CLI
    )

    if admin_user.new_record?
      pw = SecureRandom.hex
      admin_user.password = pw
      admin_user.password_confirmation = pw
      admin_user.save
    end

    Settings.potentially_update_from_environment!

    logger.info("Creating CLI user: cli@manifold.app".green)
  end
  # rubocop:enable Metrics/MethodLength
end
