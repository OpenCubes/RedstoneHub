<?php

namespace RSHub\MarketplaceBundle\Form;

use Symfony\Component\Form\AbstractType;
use Symfony\Component\Form\FormBuilderInterface;
use Symfony\Component\OptionsResolver\OptionsResolverInterface;

class ModificationType extends AbstractType {
	/**
	 *
	 * @param FormBuilderInterface $builder        	
	 * @param array $options        	
	 */
	public function buildForm(FormBuilderInterface $builder, array $options) {
		$builder->add('name', 'text')
				->add('author', 'text')
				->add('summary', 'text')
				->add('description', 'textarea')
				->add('icon', 'url')
				->add('downloads', 'integer')
				->add('stars', 'integer')
				->add('version', 'text')
				->add('downloadLink', 'text');
	}

	/**
	 *
	 * @param OptionsResolverInterface $resolver        	
	 */
	public function setDefaultOptions(OptionsResolverInterface $resolver) {
		$resolver->setDefaults(
						array(  
								'data_class' => 'RSHub\MarketplaceBundle\Entity\Modification'));
	}

	/**
	 *
	 * @return string
	 */
	public function getName() {
		return 'rshub_marketplacebundle_modificationtype';
	}
}
