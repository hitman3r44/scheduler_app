Rails.application.routes.draw do

  root to: 'schedulers#home'
  resources :students
  resources :sessions, only: [:new, :create, :destroy]
  match '/signup', to: 'students#new', via: :get
  match '/signin', to: 'sessions#new', via: :get
  match '/signout', to: 'sessions#destroy', via: :delete

  get 'students/:id', to: 'students#show'
  get 'students/:id/registration', to: 'students#registration'
  get 'schedulers/mysequence'
  resources :mysequence

  match 'contacts', to: 'contacts#new', via: 'get'
  resources "contacts", only: [:new, :create]

  match "/scheduler_generator/preference_generator", to: "scheduler_generator#preference_generator", via: :get
  match "/scheduler_generator/select_a_schedule", to: "scheduler_generator#select_a_schedule", via: :get
  match '/scheduler_generator/student_registered_courses', to: 'scheduler_generator#student_registered_courses', via: :get
  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
