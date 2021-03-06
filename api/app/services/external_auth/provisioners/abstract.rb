module ExternalAuth
  module Provisioners
    # Apply data to a user from an OmniAuth hash
    # based on the provider
    class Abstract
      extend ActiveModel::Callbacks

      define_model_callbacks :provision

      attr_reader :auth_hash

      attr_reader :provider

      attr_reader :user

      delegate :info, to: :auth_hash, prefix: :auth

      delegate :facebook?, :google_oauth2?, :twitter?, to: :provider

      def initialize(auth_hash:, provider:)
        @auth_hash  = auth_hash
        @provider   = ActiveSupport::StringInquirer.new(provider.to_s)
      end

      def call(user)
        @user = user

        run_callbacks :provision do
          nil
        end

        return user
      ensure
        @user = nil
      end

      alias google? google_oauth2?

      def facebook_or_google?
        facebook? || google?
      end
    end
  end
end
